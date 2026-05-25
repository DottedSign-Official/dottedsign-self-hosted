class Factories::Envelope::Starter < ServiceCaller
  def initialize(envelope, client_params)
    @envelope = envelope
    @client_params = client_params
  end

  def call
    ActiveRecord::Base.transaction do
      start_envelope
      start_tasks
    end
    @result = { category_for_owner_after_start: @envelope.category_for_owner_after_start }
  end

  private

  def start_envelope
    raise ServiceError.new(:envelope_is_not_draft) unless @envelope.draft?
    @envelope.start(@client_params)
  end

  def start_tasks
    @envelope.sign_tasks.each do |task|
      raise ServiceError.new(:task_is_not_draft) unless task.draft?
      task.start(@client_params)
    end
  end
end
