class DataInsert < ServiceCaller
  attr_reader :stage

  VALID_SIGNATURE_TYPES = [:signature, :guest_signature].freeze

  def initialize(stage_class, stage_id, sign_info, options: {})
    @stage_class = stage_class
    @stage_id = stage_id
    @sign_info = sign_info
    @options = options
    @working_dir = "tmp/data_insert/#{SecureRandom.hex(10)}"
    FileUtils.mkdir_p(@working_dir)
  end

  def call
    setup_stage_and_xfdf
    setup_time_formatting
    cache_image_records
    process_sign_data
    set_new_xfdf_content
  ensure
    FileUtils.rm_rf(@working_dir)
  end

  private

  def setup_stage_and_xfdf
    @stage = @stage_class.constantize.find_by_id(@stage_id)
    raise ServiceError.new(:stage_not_found) if @stage.nil?
    raise ServiceError.new(:invalid_object_id) if (@sign_info.pluck('object_id') - @stage.pdf_object_info).present?
    clear_xfdf_and_field_settings if @stage.modifying?
    @xfdf_xml = Nokogiri::XML(@stage.xfdf_content)
  end

  def clear_xfdf_and_field_settings
    @stage.xfdf_document.update(content: nil)
    @stage.field_settings.update_all(field_value: nil)
  end

  def setup_time_formatting
    sign_task = @stage.source
    owner = sign_task.owner
    with_timestamp = owner.preference_info['signature_timestamp']
    time_zone = sign_task.start_from['time_zone'] || TimezoneMapping[:hour_zone].default
    date_format = parse_date_format(owner.preference_info['date_format'])
    @formatted_time_string = if with_timestamp && @options[:timestamp].present?
      Time.at(@options[:timestamp]).in_time_zone(time_zone).strftime(date_format)
    end
  end

  def cache_image_records
    @cached_signature_info_map = {}
    image_data_map = @sign_info.select { |sign_data| VALID_SIGNATURE_TYPES.include?(sign_data['type'].to_sym) }
                               .group_by { |sign_data| sign_data['type'] }

    image_data_map.each do |signature_type, sign_infos|
      signature_ids = sign_infos.map { |sign_data| sign_data['value'] }
      signatures = signature_type.camelize.constantize.where(id: signature_ids)
      @cached_signature_info_map[signature_type] = signatures.index_by(&:id).transform_values do |signature|
        { record: signature, file_with_timestamp: nil }
      end
    end
  end

  def process_sign_data
    @sign_info.each do |sign_data|
      next if sign_data['type'] == 'systemtime'
      process_single_sign_item(sign_data)
    end
  end

  def process_single_sign_item(sign_data)
    field_xml = obtain_field_xml(sign_data)
    insert = insert_now(field_xml, sign_data)
    raise insert.error if insert.failed?
    field_setting = setup_field_setting(field_xml, sign_data)
    setup_signature_other_info(sign_data, field_setting)
  end

  def obtain_field_xml(sign_data)
    field_xml = @xfdf_xml.xpath("//*[@fieldname=\"#{sign_data['object_id']}\"]")[0]
    raise ServiceError.new(:invalid_object_id, error_msg: "no sign_data['type'] fields with #{sign_data['object_id']}") if field_xml.nil?
    field_xml
  end

  def insert_now(field_xml, sign_data)
    case sign_data['type']
    when 'signature', 'guest_signature'
      ImageInsert.call(field_xml, image_content(sign_data))
    when 'image'
      ImageInsert.call(field_xml, image_field_content(sign_data))
    when 'textfield', 'datefield', 'link'
      TextInsert.call(field_xml, sign_data)
    when 'checkbox', 'radio'
      BoxInsert.call(field_xml, sign_data['value'])
    end
  end

  def image_content(sign_data)
    signature_info = find_signature_for(sign_data)
    return if signature_info.nil?

    signature = signature_info[:record]
    if @formatted_time_string
      signature_info[:file_with_timestamp] ||= create_timestamped_image(signature)
      File.read(signature_info[:file_with_timestamp])
    else
      signature.update_to_png!
      signature.signature_raw
    end
  end

  def find_signature_for(sign_data)
    signature_type = sign_data['type'] || 'signature'
    @cached_signature_info_map.dig(signature_type, sign_data['value'].to_i)
  end

  def create_timestamped_image(signature)
    image_timestamp = DataInsert::ImageTimestamp.call(signature, @formatted_time_string, working_dir: @working_dir)
    raise ServiceError.new(:sign_failed, image_timestamp.error) if image_timestamp.failed?
    image_timestamp.result
  end

  def setup_field_setting(field_xml, sign_data)
    field_setting = find_or_create_field_setting(sign_data['object_id'])
    setup_field_setting_properties(field_setting, field_xml, sign_data)
    setup_field_setting_options(field_setting, sign_data)
    field_setting.save
    field_setting
  end

  def find_or_create_field_setting(object_id)
    @stage.field_settings.find_or_initialize_by(
      source_type: @stage.source_type,
      source_id: @stage.source_id,
      field_object_id: object_id
    )
  end

  def setup_field_setting_properties(field_setting, field_xml, sign_data)
    field_setting.field_type ||= field_type_from_field_xml(field_xml)
    field_setting.coord ||= field_xml.attribute('rect').content.split(',').map(&:to_f)
    field_setting.page ||= field_xml.attribute('page').content.to_i
    field_setting.field_value = sign_data['value']
  end

  def setup_field_setting_options(field_setting, sign_data)
    field_setting.options['signature_type'] = sign_data['type'] if sign_data['type'] == 'guest_signature'

    # This parameter is reserved for future use. There is no timestamp text in the signature raw.
    # If field_value_with_timestamp is true, fetch the signature with a timestamp from the XFDF.
    field_setting.options['field_value_with_timestamp'] = true if @formatted_time_string

    same_options_keys = field_setting.options.keys & sign_data.keys
    same_options_keys.each { |key| field_setting.options[key] = sign_data[key] }
  end

  def field_type_from_field_xml(field_xml)
    case field_xml.name
    when 'signature'
      'signature'
    when 'image'
      'image'
    when 'textfield'
      field_xml.attribute('textfield-spe')&.content == 'textfield-date' ? 'datefield' : 'textfield'
    when 'checkbox'
      field_xml.attribute('style').content == '0' ? 'checkbox' : 'radio'
    end
  end

  def image_field_content(sign_data)
    image = Image.find_by(id: sign_data['value'])
    return if image.nil?
    image.update_to_png!
    image.image_raw
  end

  def set_new_xfdf_content
    xfdf_document = @stage.xfdf_document
    xfdf_document.content = @xfdf_xml.to_s
    xfdf_document.save!
  end

  def parse_date_format(date_format)
    return '%Y/%m/%d %H:%M:%S UTC%:z' if date_format.nil?

    format_map = {
      'yyyy' => '%Y',
      'mm'   => '%m',
      'dd'   => '%d',
      'HH'   => '%H',
      'MM'   => '%M',
      'SS'   => '%S'
    }
    format_regex = Regexp.union(format_map.keys)
    date_format = date_format.gsub(format_regex) { |key| format_map[key] }
    date_format += ' %H:%M:%S UTC%:z'
  end

  def setup_signature_other_info(sign_data, field_setting)
    return unless VALID_SIGNATURE_TYPES.include?(sign_data['type'].to_sym)
    signature_info = find_signature_for(sign_data)
    return if signature_info.nil?
    signature = signature_info[:record]
    return unless signature.category == 'signature_with_photo'
    signature.update!(other_info: { task_id: field_setting.source_id, field_setting_id: field_setting.id })
  end
end
