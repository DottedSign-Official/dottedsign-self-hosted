module KmpdfTool
  class PdfAnnotateGenerator < ServiceCaller
    include CommandExecute

    attr_reader :working_dir

    GENERATE_ANNOT_TYPES = ['link', 'underline'].freeze
    GENERATE_CMD = "#{Settings.pdf_tool_path} json -j %{json_file} %{output_file_opt} %{input_file}".freeze

    def initialize(field_settings, input_file, generate_annot_types: [], incremental_update: false)
      @field_settings = field_settings || []
      @input_file = input_file
      @generate_annot_types = generate_annot_types.blank? ? GENERATE_ANNOT_TYPES : generate_annot_types
      @incremental_update = incremental_update
    end

    def call
      check_file
      setup_working_dir
      return @result = @input_file if cmd_json_content.empty?
      generate_annot_json_file
      generate_annot_file
      @result = @annot_file
    end

    private
    
    def check_file
      raise ServiceError.new(:file_not_found) unless File.exist?(@input_file)
    end

    def setup_working_dir
      @working_dir = File.dirname(@input_file)
    end

    def generate_annot_json_file
      @json_file = "#{@working_dir}/annot_file.json"
      File.open(@json_file, 'w+') do |file|
        file.write(cmd_json_content.to_json)
      end
    end

    def generate_annot_file
      @annot_file = @incremental_update ? @input_file : "#{@working_dir}/annot_file.pdf"
      output_file_opt = @incremental_update ? '' : "-o #{@annot_file}"
      cmd_info = {
        input_file: @input_file,
        output_file_opt: output_file_opt,
        json_file: @json_file
      }
      generate_cmd = GENERATE_CMD % cmd_info
      generate_result = execute_system_cmd(generate_cmd)
      raise ServiceError.new(:command_execute_failed, error_message: "run '#{generate_cmd}' failed: #{generate_result}") if command_failed?(generate_result)
    end

    def cmd_json_content
      return @content unless @content.nil?

      annot_content = @field_settings.map do |field_setting|
        next if hide_annot?(field_setting)
        annot_types = get_annot_types(field_setting.field_type)
        annot_types.map do |annot_type|
          method_name = "format_#{annot_type}_json"
          next unless respond_to?(method_name, true)
          send(method_name, field_setting)
        end
      end.flatten.compact
      @content = annot_content.empty? ? {} : {
        version: "1.0",
        workflow: [{
          command: "create",
          annots: annot_content
        }]
      }
    end

    def hide_annot?(field_setting)
      return false unless field_setting.field_type == 'link'
      field_setting.field_value.blank?
    end

    def get_annot_types(field_type)
      annot_types = []
      case field_type
      when 'link'
        annot_types += ['link', 'underline']
      end
      annot_types & @generate_annot_types
    end

    def format_link_json(field_setting)
      field_json = field_base_json(field_setting)
      field_json[:type] = 'Link'
      field_json[:tourl] = field_setting.field_value
      field_json[:transparency] = 1
      field_json[:rect] = cal_link_rect(field_setting)
      field_json
    end

    def format_underline_json(field_setting)
      field_json = field_base_json(field_setting)
      field_json[:type] = 'Underline'
      field_json[:bdcolor] = "#0000FF"
      field_json[:transparency] = 1
      lx, by, rx, ty = cal_link_rect(field_setting)
      ty = by + 5
      field_json["quad-points"] = [lx, ty, rx, ty, lx, by, rx, by].join(',')
      field_json
    end

    def cal_link_rect(field_setting)
      width, height = field_setting.text_dimensions
      return field_setting.coord if width.blank? || height.blank?

      lx, by, rx, ty = field_setting.coord
      my = (ty + by) / 2

      n_ty = my + height / 2 + 1
      n_by = my - height / 2 - 1
      n_lx = lx
      n_rx = rx

      if rx - lx > width
        n_rx = lx + width
      end

      [n_lx, n_by, n_rx, n_ty]
    end

    def field_base_json(field_setting)
      {
        page: field_setting.page || 0,
        title: field_setting.field_object_id,
        bdwidth: 0
      }
    end

  end
end