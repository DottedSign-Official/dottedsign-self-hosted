class TaskSetting < Setting
  belongs_to :sign_task

  after_commit :deadline_changed, on: :update, if: :deadline_previously_changed?

  alias :source :sign_task
  alias_attribute :source_id, :sign_task_id

  include Settings::Encryptable
  class << self

    def setup_from_source_id(sign_task_id)
      find_or_initialize_by(sign_task_id: sign_task_id)
    end

  end

  def source_type
    'SignTask'
  end
end
