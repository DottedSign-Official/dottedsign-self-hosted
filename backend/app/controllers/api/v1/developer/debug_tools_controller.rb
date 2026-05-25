class Api::V1::Developer::DebugToolsController < Api::V1::DeveloperController

  def sidekiq_retry_list
    service = Developer::SidekiqRetryList.call(["ReadableFileGeneratorWorker"])
    return error_response(service.error.key) if service.failed?
    success_response(service.result)
  end

end
