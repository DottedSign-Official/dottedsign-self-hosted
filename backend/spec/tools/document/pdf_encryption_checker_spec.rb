require 'rails_helper'

RSpec.describe Document::PdfEncryptionChecker, type: :service do
  describe '.encrypted?' do
    context 'when the fixture pdf is encrypted' do
      let(:input_path) { Rails.root.join('spec/fixtures/files/test_protected_1111.pdf').to_s }

      it 'returns true' do
        allow(described_class).to receive(:execute_system_cmd).and_call_original

        expect(described_class.encrypted?(input: input_path)).to eq(true)
        expect(described_class).to have_received(:execute_system_cmd).with("qpdf --show-encryption #{Shellwords.escape(input_path)} 1>&2")
      end
    end

    context 'when the fixture pdf is not encrypted' do
      let(:input_path) { Rails.root.join('spec/fixtures/files/test.pdf').to_s }

      it 'returns false' do
        allow(described_class).to receive(:execute_system_cmd).and_call_original

        expect(described_class.encrypted?(input: input_path)).to eq(false)
      end
    end
  end
end
