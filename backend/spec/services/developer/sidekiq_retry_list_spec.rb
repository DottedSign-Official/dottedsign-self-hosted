# spec/services/developer/sidekiq_retry_list_spec.rb
require 'rails_helper'

RSpec.describe Developer::SidekiqRetryList do
  describe '#call' do
    let(:worker_name) { 'ReadableFileGeneratorWorker' }
    let(:service) { described_class.new([worker_name]) }

    context 'when there are no retries jobs' do
      it 'returns an empty array' do
        allow(Sidekiq::RetrySet).to receive(:new).and_return([])
        service.call
        expect(service.result).to eq([])
      end
    end

    context 'when there are retries jobs for the specified worker' do
      let(:job) do
        double(
          'Sidekiq Job',
          klass: worker_name,
          args: [1, false],
          jid: '123',
          item: { 'error_message' => 'some error' }
        )
      end

      it 'returns a list of retries jobs with related task_id' do
        allow(Sidekiq::RetrySet).to receive(:new).and_return([job])
        allow(ServiceFile).to receive(:includes).and_return(ServiceFile)
        allow(ServiceFile).to receive(:where).and_return([double(storable_type: 'SignTask', storable_id: 2, id: 1)])

        service.call
        expect(service.result).to eq([
                                       {
                                         klass: worker_name,
                                         args: [1, false],
                                         jid: '123',
                                         relation: { task_id: 2 },
                                         error_message: 'some error'
                                       }
                                     ])
      end
    end
  end
end
