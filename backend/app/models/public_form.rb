require 'csv'

class PublicForm < ApplicationRecord
  include Storable
  
  belongs_to :owner, class_name: 'Member', foreign_key: :owner_id
  belongs_to :template
  has_many :sign_tasks
  has_many :completed_tasks, -> { completed }, class_name: 'SignTask'

  # Status rules:
  # - publish: can collect responses; can transition to unpublish
  # - unpublish: cannot collect responses; can transition back to publish
  # - terminated: cannot transition to publish or unpublish; may result from reaching the goal or the template being deleted
  enum status: [:publish, :unpublish, :terminated]

  scope :active, -> { where(is_deleted: false) }
  scope :display_order, -> { order(created_at: :desc) }

  after_find :check_status, if: Proc.new { |form| form.with_limit? && form.publish? }
  before_save :set_publish_at, if: :status_changed?
  before_create :set_uuid

  AVAILABLE_STATUSES = [:publish, :unpublish].freeze

  class << self

    def unpublish_all
      self.update_all(status: PublicForm.statuses[:unpublish])
    end

    def related_to(member)
      where(owner_id: member.id).where(group_id: [nil, member.active_group_id])
    end

    def related_ids(member)
      related_to(member).pluck(:id)
    end

  end

  def display
    info = as_json(except: [:created_at, :updated_at, :end_at], methods: [:template_name])
    info[:end_at] = end_at&.to_i
    info
  end

  def template_name
    template.file_name
  end

  def finish_num
    completed_tasks.count
  end

  def with_limit?
    goal_num > 0 || end_at.present?
  end

  def publishable?
    !template.deleted? && !reach_limit?
  end

  def set_delete
    update(is_deleted: true)
    template.deleted!
  end

  def finish_form
    self.terminated! if reach_limit?
  end

  def reach_limit?
    reach_goal? || reach_end?
  end

  def reach_goal?
    return false unless goal_num > 0
    sent_num >= goal_num
  end

  def reach_end?
    end_at.present? && end_at <= Time.zone.now
  end

  def csv_content(time_zone = 'Etc/UTC')
    csv_header = ['Task ID', 'Task Name', 'Created Time']
    signer_infos.length.times do |num|
      csv_header += ["Form Signer #{num + 1} Name", "Form Signer #{num + 1} Email"]
    end

    CSV.generate do |csv|
      csv.to_io.write("\uFEFF") # BOM
      csv << csv_header
      completed_tasks.includes(:modified_events, sign_stages: :actor).each do |task|
        created_display = task.created_at.in_time_zone(time_zone).strftime('%Y-%m-%d %H:%M:%S %Z')

        task_info  = [task.id, task.file_name, created_display]
        task.sign_stages.each do |stage|
          task_info += [stage.actor_display_name, stage.actor_display_email]
        end

        csv << task_info
      end
    end
  end

  private

  def set_uuid
    loop do
      self.uuid = SecureRandom.uuid
      break if PublicForm.find_by(uuid: uuid).nil?
    end
  end

  def check_status
    self.terminated! unless publishable?
  end

  def set_publish_at
    self.publish_at = Time.zone.now if publish?
  end
end
