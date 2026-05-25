require 'rails_helper'
require 'on_premise_license/plan_reader'

RSpec.describe TaskCompletedProcessWorker do
  let(:task) { instance_double(SignTask, id: 42) }

  before do
    allow(SignTask).to receive(:find_by).with(id: 42).and_return(task)
  end

  if defined?(Sidekiq::Batch)
    context 'when license plan is enterprise' do
      before do
        allow(OnPremiseLicense::PlanReader).to receive(:enterprise?).and_return(true)
      end

      it 'enqueues AuditTrail and SignatureCompress inside a Sidekiq::Batch' do
        fake_batch = instance_double(Sidekiq::Batch)
        sub_batch  = instance_double(Sidekiq::Batch)
        allow(Sidekiq::Batch).to receive(:new).and_return(fake_batch, sub_batch)
        allow(fake_batch).to receive(:description=)
        allow(sub_batch).to receive(:description=)
        allow(sub_batch).to receive(:on)
        allow(fake_batch).to receive(:jobs).and_yield
        allow(sub_batch).to receive(:jobs).and_yield

        expect(AuditTrailGenerateWorker).to receive(:perform_async).with(42)
        expect(SignatureCompressWorker).to receive(:perform_async).with(42)

        described_class.new.perform(42)
      end

      it 'registers on_success callback when options["callback"] is set' do
        fake_batch = instance_double(Sidekiq::Batch)
        sub_batch  = instance_double(Sidekiq::Batch)
        allow(Sidekiq::Batch).to receive(:new).and_return(fake_batch, sub_batch)
        allow(fake_batch).to receive(:description=)
        allow(sub_batch).to receive(:description=)
        allow(fake_batch).to receive(:jobs).and_yield
        allow(sub_batch).to receive(:jobs).and_yield
        allow(AuditTrailGenerateWorker).to receive(:perform_async)
        allow(SignatureCompressWorker).to receive(:perform_async)

        expect(sub_batch).to receive(:on).with(:success, TaskCompletedProcessWorker, task_id: 42)

        described_class.new.perform(42, 'callback' => true)
      end
    end
  end

  context 'when license plan is NOT enterprise' do
    before do
      allow(OnPremiseLicense::PlanReader).to receive(:enterprise?).and_return(false)
    end

    it 'invokes AuditTrail then SignatureCompress synchronously in order' do
      audit    = instance_double(AuditTrailGenerateWorker)
      compress = instance_double(SignatureCompressWorker)
      allow(AuditTrailGenerateWorker).to receive(:new).and_return(audit)
      allow(SignatureCompressWorker).to receive(:new).and_return(compress)

      call_order = []
      expect(audit).to receive(:perform).with(42) { call_order << :audit }
      expect(compress).to receive(:perform).with(42) { call_order << :compress }

      expect(Sidekiq::Batch).not_to receive(:new) if defined?(Sidekiq::Batch)
      described_class.new.perform(42)

      expect(call_order).to eq([:audit, :compress])
    end

    it 'enqueues CallbackWorker after sync chain when options["callback"] is set' do
      audit    = instance_double(AuditTrailGenerateWorker)
      compress = instance_double(SignatureCompressWorker)
      allow(AuditTrailGenerateWorker).to receive(:new).and_return(audit)
      allow(SignatureCompressWorker).to receive(:new).and_return(compress)
      allow(audit).to receive(:perform).with(42)
      allow(compress).to receive(:perform).with(42)

      expect(CallbackWorker).to receive(:perform_async).with('SignTask', 42)
      described_class.new.perform(42, 'callback' => true)
    end

    it 'does NOT enqueue CallbackWorker when callback option is absent' do
      audit    = instance_double(AuditTrailGenerateWorker)
      compress = instance_double(SignatureCompressWorker)
      allow(AuditTrailGenerateWorker).to receive(:new).and_return(audit)
      allow(SignatureCompressWorker).to receive(:new).and_return(compress)
      allow(audit).to receive(:perform).with(42)
      allow(compress).to receive(:perform).with(42)

      expect(CallbackWorker).not_to receive(:perform_async)
      described_class.new.perform(42)
    end
  end

  it 'returns early when task is not found' do
    allow(SignTask).to receive(:find_by).with(id: 99).and_return(nil)
    expect(Sidekiq::Batch).not_to receive(:new) if defined?(Sidekiq::Batch)
    expect(AuditTrailGenerateWorker).not_to receive(:perform_async)
    described_class.new.perform(99)
  end
end
