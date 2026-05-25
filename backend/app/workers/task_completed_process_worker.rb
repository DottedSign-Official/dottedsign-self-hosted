require 'on_premise_license/plan_reader'

class TaskCompletedProcessWorker < GeneralWorker

  def perform(task_id, options = {})
    task = SignTask.find_by(id: task_id)
    return if task.nil?

    if OnPremiseLicense::PlanReader.enterprise?
      perform_with_batch(task_id, options)
    else
      perform_sync(task_id, options)
    end
  end

  def on_success(status, options)
    batch = Sidekiq::Batch.new(status.parent_bid)
    batch.jobs do
      sub_batch = Sidekiq::Batch.new
      sub_batch.description = "Callback for task #{options['task_id']}"
      sub_batch.jobs do
        CallbackWorker.perform_async('SignTask', options['task_id'])
      end
    end
  end

  private

  def perform_with_batch(task_id, options)
    batch = Sidekiq::Batch.new
    batch.description = "Task Completed Process Job"
    batch.jobs do
      sub_batch = Sidekiq::Batch.new
      sub_batch.description = "Generate audit trail and compress signature photos for task #{task_id}"
      sub_batch.on(:success, TaskCompletedProcessWorker, task_id: task_id) if options['callback']
      sub_batch.jobs do
        AuditTrailGenerateWorker.perform_async(task_id)
        SignatureCompressWorker.perform_async(task_id)
      end
    end
  end

  def perform_sync(task_id, options)
    AuditTrailGenerateWorker.new.perform(task_id)
    SignatureCompressWorker.new.perform(task_id)
    CallbackWorker.perform_async('SignTask', task_id) if options['callback']
  end
end
