class TemplateMerger < ServiceCaller
  attr_reader :file_path, :working_dir
  include PdfReader

  def initialize(member_id, templates, task_info)
    @member_id = member_id
    @templates = templates
    @task_info = task_info
    @stage_infos = task_info[:stages]
    @file_paths = []

    @working_dir = Settings.create_cache_working_dir
  end

  def call
    setup_stages
    merge_field_settings
    merge_stages
    merge_pdfs
    @result = build_dummy_template
  end

  private

  def setup_stages
    @stages = @templates.flat_map(&:dummy_stages)
  end

  def merge_field_settings
    page = 0
    @dummy_field_settings = @templates.each_with_object([]) do |template, field_settings|
      field_settings << build_dummy_field_settings(template, page)

      @file_paths << file_path = "#{@working_dir}/#{template.code}.pdf"
      page += download_and_read_page(file_path, template.original_file)
    end
  end

  def build_dummy_field_settings(template, page)
    template.field_settings.map do |field|
      field_info = field.deep_dup
      field_info.page += page
      field_info.field_object_id = SecureRandom.uuid
      field_info
    end
  end

  def merge_stages
    grouped_stages = @stages.group_by { |stage| stage.actor_info['role'] }
    grouped_field_settings = @dummy_field_settings.flatten.group_by { |field| field.stage.id }

    no_order_sequence = @stage_infos.length
    @dummy_stages = @stage_infos.pluck(:role).map.with_index do |role, index|
      stages = grouped_stages[role].uniq(&:id)
      field_settings = stages.flat_map { |stage| grouped_field_settings[stage.id] }

      build_dummy_stage(role: role,
                        sequence: @task_info[:has_order] ? (index + 1) : no_order_sequence,
                        field_settings: field_settings)
    end
  end

  def build_dummy_stage(field_settings:, role:, sequence:)
    dummy_stage = DummyStage.new
    dummy_stage.actor_info['role'] = role
    dummy_stage.sequence = sequence
    dummy_stage.field_settings = field_settings
    dummy_stage.pdf_object_info = field_settings.pluck(:field_object_id)
    dummy_stage
  end

  def merge_pdfs
    output_path = "#{@working_dir}/merged.pdf"

    merger = KmpdfTool::PdfFileMerge.call(output_path, @file_paths)
    raise ServiceError.new(:file_merge_failed) if merger.failed?

    @file_path = output_path
  end

  def build_dummy_template
    template = Template.new(owner_id: @member_id)
    template.assign_attributes(@task_info.slice(*Template.column_names))
    template.dummy_stages = @dummy_stages
    template
  end
end
