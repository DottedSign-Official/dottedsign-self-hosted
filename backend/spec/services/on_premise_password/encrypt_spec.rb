require 'rails_helper'

RSpec.describe OnPremisePassword::Encrypt, type: :model do
  describe '#call' do
    before(:each) do
      @raw_string = 'jackrabbit_24373514'
    end

    it 'should encrypt the string from public key' do
      encrypter = OnPremisePassword::Encrypt.call(@raw_string)
      expect(encrypter.success?).to eq(true)

      decrypter = OnPremisePassword::Decrypt.call(encrypter.result)
      expect(decrypter.success?).to eq(true)
      expect(decrypter.result).to eq(@raw_string)
    end
  end
end
