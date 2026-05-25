class CaRetry < ApplicationRecord
  belongs_to :service_file

  enum status: ['retry_failed', 'retry_succeed']

  def add_retry_count(error_message)
    self.retry_count = self.retry_count + 1
    self.error_message = error_message
    self.status = :retry_failed
    self.save!
  end

  def retry_succeed!
    self.status = :retry_succeed
    self.save!
  end

  class << self
    def obtain_failed_tasks_ids_object
      loop_retry_length = GeneralWorker::FAIL_RETRY_IN.length + 1
      failed_task = {
        failed: [],
        fail_retrying: []
      }

      CaRetry.includes(:service_file, service_file: [:storable]).where(status: :retry_failed).each do |ca_retry|
        if ca_retry.retry_count % loop_retry_length == 0
          failed_task[:failed] << ca_retry.service_file.storable.id
        else
          failed_task[:fail_retrying] << ca_retry.service_file.storable.id
        end
      end
      failed_task
    end

    def ca_retry_now_form_task(task)
      retry_set = Sidekiq::RetrySet.new
      service_file_ids = task.obtain_all_service_file_ids
      CaRetry.includes(:service_file, service_file: [:storable]).where(service_file_id: service_file_ids, status: :retry_failed).each do |ca_retry|
        job = retry_set.find { |j| j.klass == 'ReadableFileGeneratorWorker' && j.args[0] == ca_retry.service_file_id }
        reset_retry_count(ca_retry)
        if job
          job.retry
        else
          new_retry_ca_job(ca_retry)
        end
      end
    end

    private

    def reset_retry_count(ca_retry)
      loop_retry_length = GeneralWorker::FAIL_RETRY_IN.length + 1
      remainder = ca_retry.retry_count % loop_retry_length
      new_ca_retry = remainder == 0 ? ca_retry.retry_count : ca_retry.retry_count + loop_retry_length - remainder
      ca_retry.retry_count = new_ca_retry
      ca_retry.save!
    end

    def new_retry_ca_job(ca_retry)
      need_digital_certificate = false
      service_file_storable = ca_retry.service_file.storable
      case service_file_storable.class.to_s
      when 'SignTask'
        need_digital_certificate = service_file_storable.setting_info['need_ca']
      when 'SignStage'
        need_digital_certificate = service_file_storable.need_stage_cert?
      end

      ReadableFileGeneratorWorker.perform_async(ca_retry.service_file_id, need_digital_certificate)
    end

  end
end
