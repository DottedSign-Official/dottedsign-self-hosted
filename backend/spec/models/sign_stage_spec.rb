require 'rails_helper'

RSpec.describe SignStage, type: :model do
  describe 'after_commit' do

    it 'after_commit when sign stage status become processing_file_failed' do
      task = FactoryBot.create(:quick_sign_task)
      stage = task.processing_stages[0]
      allow(MailCenter).to receive(:signer_ca_fail_notify).and_return({ 'status' => 200 })
      allow(stage).to receive(:actions_after_processing_file_failed)
      expect(stage.status).to eq('processing')
      stage.processing_file_failed!

      expect(stage).to have_received(:actions_after_processing_file_failed)
    end
  end
end