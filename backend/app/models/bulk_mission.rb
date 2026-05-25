class BulkMission < ApplicationRecord
  belongs_to :owner, class_name: 'Member', foreign_key: :owner_id
  belongs_to :template
  has_many :sign_tasks
  has_many :processing_tasks, -> { waiting }, class_name: 'SignTask'
  has_many :completed_tasks, -> { completed }, class_name: 'SignTask'
  has_many :finished_tasks, -> { where(status: [:completed, :deleted, :declined])}, class_name: 'SignTask'
  has_one :compress_file, -> {uploaded.where(label: 'compress')}, as: :storable, class_name: 'ServiceFile'

  before_create :setup_uuid

  enum status: [:created, :processing, :completed]

  scope :with_display_content, -> { includes(:template, :processing_tasks, :completed_tasks) }

  include ShareStorable

  class << self

    def setup_from_request(member_id, template_id, task_infos, setting_info: {}, client_info: {})
      mission = BulkMission.create({
        owner_id: member_id,
        template_id: template_id,
        count: task_infos.length,
        setting_info: setting_info,
        client_info: client_info
      })
      task_infos.each_with_index do |task_info, index|
        Rails.cache.write("bulk:#{mission.uuid}:#{index+1}", task_info.to_h)
      end
      mission
    end

    def related_to(member)
      where(owner_id: member.id)
    end

  end

  def start
    self.processing!
    base_time = Time.zone.now
    count.times do |times|
      base_time += rand(1..6) * 30.seconds
      BulkSendWorker.perform_at(base_time, id, times + 1)
    end
  end

  def display
    {
      uuid: uuid,
      template_name: template.file_name,
      count: count,
      processing_count: processing_tasks.length,
      completed_count: completed_tasks.length,
      status: status,
      created_at: created_at.to_i
    }
  end

  def before_completed
    MissionTasksCompressWorker.perform_async(id) if all_task_finished?
  end

  def do_completed
    self.completed!
  end

  def accessibility_of(member)
    if owned_by_member?(member)
      :accessible
    else
      :not_accessible
    end
  end

  def owned_by_member?(member)
    owner_id == member.id
  end

  def all_task_finished?
    count == finished_tasks.count
  end

  private

  def setup_uuid
    loop do
      self.uuid = SecureRandom.uuid
      break if BulkMission.find_by_uuid(uuid).nil?
    end
  end

end
