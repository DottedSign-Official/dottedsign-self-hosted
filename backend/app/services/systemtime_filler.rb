class SystemtimeFiller < ServiceCaller
  def initialize(task)
    @task = task
  end

  def call
    setup_systemtimes
    return if @systemtimes.blank?

    @systemtimes.each { |systemtime| insert_data(systemtime) }
  end

  private

  def setup_systemtimes
    @systemtimes = @task.field_settings.where(field_type: 'systemtime')
  end

  def current_date
    @current_date ||= DateTime.now.in_time_zone
  end

  def insert_data(systemtime)
    value = format_date(systemtime.options['format']).to_s
    xfdf_xml = Nokogiri::XML(systemtime.stage.xfdf_content)
    field_xml = xfdf_xml.xpath("//*[@fieldname=\"#{systemtime.field_object_id}\"]")[0]

    insert = DataInsert::TextInsert.call(field_xml, { value: value }.as_json)
    raise insert.error if insert.failed?

    systemtime.stage.xfdf_document.update(content: xfdf_xml)
    systemtime.update(field_value: value)
  end

  def format_date(field_format)
    case field_format
    when 'year_roc'
      current_date.year - 1911
    when 'year_ad'
      current_date.year
    when 'month'
      current_date.month
    when 'day'
      current_date.day
    end
  end
end
