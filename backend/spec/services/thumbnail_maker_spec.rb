require 'rails_helper'
require 'tmpdir'

RSpec.describe ThumbnailMaker, type: :service do
  describe '#make_thumbnail_with_fallback' do
    let(:maker) { described_class.new(1) }
    let(:source_path) { '/tmp/source.pdf' }

    it 'uses original file directly when no password is configured' do
      allow(maker).to receive(:thumbnail_password).and_return(nil)
      allow(maker).to receive(:make_thumbnail).with(source_path).and_return('/tmp/thumbnail.png')
      allow(maker).to receive(:encrypted?)
      allow(maker).to receive(:decrypt_pdf)

      result = maker.send(:make_thumbnail_with_fallback, source_path)

      expect(result).to eq('/tmp/thumbnail.png')
      expect(maker).not_to have_received(:encrypted?)
      expect(maker).not_to have_received(:decrypt_pdf)
    end

    it 'uses original file when the input file does not require a password' do
      allow(maker).to receive(:thumbnail_password).and_return('secret')
      allow(maker).to receive(:encrypted?).with(source_path).and_return(false)
      allow(maker).to receive(:make_thumbnail).with(source_path).and_return('/tmp/thumbnail.png')
      allow(maker).to receive(:decrypt_pdf)

      result = maker.send(:make_thumbnail_with_fallback, source_path)

      expect(result).to eq('/tmp/thumbnail.png')
      expect(maker).not_to have_received(:decrypt_pdf)
    end

    it 'uses decrypted file when the input file requires a password and decryption succeeds' do
      fixture_path = Rails.root.join('spec/fixtures/files/test_protected_1111.pdf').to_s

      Dir.mktmpdir do |working_dir|
        maker.instance_variable_set(:@working_dir, working_dir)
        allow(maker).to receive(:thumbnail_password).and_return('1111')
        allow(maker).to receive(:encrypted?).and_call_original
        allow(maker).to receive(:decrypt_pdf).and_call_original
        allow(maker).to receive(:make_thumbnail) do |path|
          expect(path).to eq(File.join(working_dir, 'source_decrypted.pdf'))
          expect(File.exist?(path)).to eq(true)
          expect(Document::PdfEncryptionChecker.encrypted?(input: path)).to eq(false)
          '/tmp/thumbnail.png'
        end

        result = maker.send(:make_thumbnail_with_fallback, fixture_path)

        expect(result).to eq('/tmp/thumbnail.png')
        expect(maker).to have_received(:encrypted?).with(fixture_path)
        expect(maker).to have_received(:decrypt_pdf).with(fixture_path, '1111')
      end
    end
  end
end
