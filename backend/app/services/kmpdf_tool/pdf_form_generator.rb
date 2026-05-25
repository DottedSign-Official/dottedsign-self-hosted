module KmpdfTool
  class PdfFormGenerator < ServiceCaller
    include CommandExecute

    attr_reader :working_dir, :storable

    GENERATE_CMD = "#{Settings.pdf_tool_path} json -j %{json_file} -o %{output_file} %{original_file}".freeze

    def initialize(storable_type, storable_id, except_ids: [])
      @storable_type = storable_type
      @storable_id = storable_id
      @alignment_hash = Hash[FieldSetting::ALLOW_ALIGNMENT.map.with_index.to_a]
      @except_ids = except_ids
      @only_visible_field = false
    end

    def call
      prepare_data
      generate_command_json_file
      generate_form_file
      @result = @form_file
    end

    private

    def prepare_data
      @storable = @storable_type.constantize.find(@storable_id)
      raise ServiceError.new(:file_not_exist) unless @storable.original_file.present?
      @field_settings = @storable.field_settings.where.not(id: @except_ids)
      raise ServiceError.new(:no_xfdf_info) if @field_settings.blank? && @except_ids.blank?
      @only_visible_field = true if @field_settings.blank? && @except_ids.present?
      @working_dir = Settings.working_dir_for(@storable, create_dir: true)
    end

    def generate_command_json_file
      return if @only_visible_field

      @json_file = "#{@working_dir}/json_file.json"
      File.open(@json_file, 'w+') do |file|
        file.write(json_file_content)
      end
    end

    def generate_form_file
      @form_file = "#{@working_dir}/full_file.pdf"
      return @storable.original_file.download_to_local(@form_file) if @only_visible_field
      @storable.original_file.file.open(tmpdir: @working_dir) do |file|
        cmd_info = {
          original_file: file.path,
          output_file: @form_file,
          json_file: @json_file
        }
        generate_cmd = GENERATE_CMD % cmd_info
        generate_result = execute_system_cmd(generate_cmd)
        raise ServiceError.new(:command_execute_failed, error_msg: "run '#{generate_cmd}' failed: #{generate_result}") if command_failed?(generate_result)
      end
    end

    def json_file_content
      {
        version: "1.0",
        workflow: [{
          command: "create",
          form: format_form_info
        }]
      }.to_json
    end

    def format_form_info
      @field_settings.map do |field_setting|
        send("format_#{field_setting.field_type}_json", field_setting)
      end
    end

    def format_signature_json(field_setting)
      field_json = field_base_json(field_setting)
      field_json[:type] = 'signature'
      field_json
    end

    def format_image_json(field_setting)
      format_signature_json(field_setting)
    end

    def format_textfield_json(field_setting, textfield_format: 0)
      field_json = field_base_json(field_setting)
      field_json[:type] = 'textfield'
      field_json[:format] = textfield_format
      field_json[:multiline] = 'yes' if field_setting.full_options['is_multi_line']
      field_json[:cfontpath] = Settings.pdf_font.path
      field_json[:cfontname] = Settings.pdf_font.name
      field_json[:fontsize] = field_setting.full_options['font_size']
      field_json[:alignment] = @alignment_hash[field_setting.full_options['alignment']]
      field_json
    end

    def format_datefield_json(field_setting)
      format_textfield_json(field_setting, textfield_format: 1)
    end

    def format_systemtime_json(field_setting)
      format_textfield_json(field_setting, textfield_format: 1)
    end

    def format_checkbox_json(field_setting, checkbox_style: 0)
      field_json = field_base_json(field_setting)
      field_json[:type] = 'checkbox'
      field_json[:style] = checkbox_style
      field_json
    end

    def format_radio_json(field_setting)
      format_checkbox_json(field_setting, checkbox_style: 1)
    end

    def format_link_json(field_setting)
      field_json = field_base_json(field_setting)
      field_json[:type] = 'textfield'
      field_json[:cfontpath] = Settings.pdf_font.path
      field_json[:cfontname] = Settings.pdf_font.name
      field_json[:fontsize] = field_setting.full_options['font_size']
      field_json[:textcolor] = "#0000FF"
      field_json
    end

    def field_base_json(field_setting)
      base_json = {
        page: field_setting.page || 0,
        rect: field_setting.coord,
        fieldname: field_setting.field_object_id,
        bdwidth: 0
      }
      if field_setting.options['border_color'].present?
        base_json[:bdwidth] = 1
        base_json[:bdcolor] = field_setting.options['border_color']
      end
      base_json[:bgcolor] = field_setting.options['background_color'] if field_setting.options['background_color'].present?
      base_json
    end

  end
end
