require 'rails_helper'

RSpec.describe Contact, type: :model do
  describe '.setup_for_member' do
    let(:member) { create(:member_a) }

    it 'finds an existing contact after normalizing email case' do
      contact = create(:contact, member: member, email: 'jeff.lin+0@gmail.com')
            
      expect {
        described_class.setup_for_member(member.id, { email: 'Jeff.Lin+0@gmail.com', name: 'Jeff Lin' })
      }.not_to change(described_class, :count)
    
      expect(contact.reload.name).to eq('Jeff Lin')
    end

    it 'normalizes the saved email before persistence' do
      described_class.setup_for_member(member.id, { email: 'Jeff.Lin+1@gmail.com', phone: '12345678' })

      saved_contact = described_class.find_by(member_id: member.id, email: 'jeff.lin+1@gmail.com')

      expect(saved_contact).to be_present
      expect(saved_contact.phone).to eq('12345678')
    end
  end
end
