class Template < ApplicationRecord
  belongs_to :owner, class_name: "Member", foreign_key: "owner_id"

  has_one :template_setting

  has_many :dummy_stages, -> { display_order }, as: :source
  has_many :xfdf_documents, as: :source
  has_many :field_settings, as: :source
  has_many :field_setting_groups, as: :source
  has_many :share_settings, as: :shared

  acts_as_taggable

  # active when the file processing is completed (in upload_file_process_worker)
  enum status: [:active, :deleted, :processing], _default: :processing
  enum usage: [:general, :public_form], _default: :general

  scope :with_display_content, -> { includes(:share_settings, :original_file, dummy_stages: [:xfdf_document, :field_settings], taggings: [:tag]) }
  scope :display_order, -> { order(updated_at: :desc) }
  scope :with_actions, -> (actions) { joins(:dummy_stages).where(dummy_stages: { action: actions }) }

  alias :setting :template_setting

  prepend ::Groupable
  include Accessible
  include CustomTaggable
  include Displayable
  include Referenceable
  include Storable
  include Searchable
  include GroupSearchable if GROUP_USE

  class << self
    def create_from_request(owner_id, template_info, setting_info = {})
      template = Template.new(owner_id: owner_id)
      template.assign_attributes(template_info.slice(*Template.column_names))
      return unless template.save

      DummyStage.setup_from_template(template.id, template_info[:stages], has_order: template.has_order)
      TemplateSetting.setup_from_request(owner_id, template.id, setting_info)
      template
    end

    def duplicate_with(code, except_ids: [])
      return false if code.blank?

      Template.where.not(id: except_ids)
              .where(code: code, status: [:active, :processing])
              .exists?
    end
  end

  def update_from_request(template_info, setting_info = {})
    update(template_info.slice(:file_name, :has_order, :group_id, :code))
    if template_info[:stages].present?
      DummyStage.setup_from_template(id, template_info[:stages], has_order: has_order)
      PdfFormGenerateWorker.perform_async('Template', id)
    end
    TemplateSetting.setup_from_request(owner_id, id, setting_info) if setting_info.present?
    self
  end

  def is_dummy?
    true
  end

  def stages
    dummy_stages
  end

  def stage_class
    'DummyStage'
  end

  def stages_xfdf_exist?
    dummy_stages.map(&:xfdf_document).all? { |xfdf| xfdf.present? }
  end

end
