module Developer
  class SidekiqRetryList < ServiceCaller
    def initialize(sidekiq_worker_names = ["ReadableFileGeneratorWorker"])
      @sidekiq_worker_names = sidekiq_worker_names
    end

    def call
      obtain_reties_jobs
      processed_readable_file_generator_worker_data
      @result = @reties_jobs
    end

    private

    def obtain_reties_jobs
      @reties_jobs = []
      retries = Sidekiq::RetrySet.new
      retries.each do |job|
        if @sidekiq_worker_names.include?(job.klass)
          @reties_jobs << {
            klass: job.klass,
            args: job.args,
            jid: job.jid,
            relation: {},
            error_message: job.item['error_message']
          }
        end
      end
    end

    def processed_readable_file_generator_worker_data
      file_ids = @reties_jobs.map { |item| item[:args].first if item[:args] }.compact
      file_and_task_mapping = {}
      ServiceFile.includes(:storable).where(id: file_ids).each do |service_file|
        case service_file.storable_type
        when 'SignTask'
          file_and_task_mapping[service_file.id] = service_file.storable_id
        when 'SignStage'
          file_and_task_mapping[service_file.id] = service_file.storable.sign_task_id
        end
      end

      @reties_jobs.each do |item|
        item[:relation][:task_id] = file_and_task_mapping[item[:args].first] if item[:args]
      end
    end
  end
end

