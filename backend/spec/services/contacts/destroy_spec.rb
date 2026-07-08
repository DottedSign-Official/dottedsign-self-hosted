require 'rails_helper'

RSpec.describe Contacts::Destroy, type: :model do
  describe '#call' do
    before(:each) do
      @member = mock_member(:member_me, skip_auth: true)
    end

    it 'destroys the member contact by normalized email' do
      contact = FactoryBot.create(:contact, member: @member, email: 'DeleteMe@Test.com')

      service = Contacts::Destroy.call(member: @member, email: '  deleteme@test.com  ')

      expect(service.success?).to eq(true)
      expect(Contact.find_by(id: contact.id)).to be_nil
    end

    it 'fails when contact does not exist' do
      service = Contacts::Destroy.call(member: @member, email: 'not-found@test.com')

      expect(service.failed?).to eq(true)
      expect(service.error.key).to eq(:contact_not_exist)
    end
  end
end
