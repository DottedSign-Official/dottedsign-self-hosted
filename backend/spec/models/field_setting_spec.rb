require 'rails_helper'

RSpec.describe FieldSetting, type: :model do
  # create a subject for each test case with FactoryBot
  subject { 
    task = FactoryBot.create(:draft_task)
    stage = task.stages.first
    FactoryBot.create(:field_setting, source: FactoryBot.create(:draft_task), stage: stage) 
  }

  it 'has a unique custom_id within the scope of source when custom_id is not blank' do
    subject.custom_id = 'custom_id'
    subject.save

    duplicate = FactoryBot.build(:field_setting, custom_id: 'custom_id', source: subject.source, stage: subject.stage)
    expect(duplicate).not_to be_valid
  end

  it 'allow same custom_id in different source' do
    subject.custom_id = 'custom_id'
    subject.save

    task = FactoryBot.create(:draft_task)
    duplicate = FactoryBot.build(:field_setting, custom_id: 'custom_id', source: task, stage: task.stages.first)
    expect(duplicate).to be_valid
  end

  it 'allows multiple records with blank custom_id in the same source' do
    subject.custom_id = ''
    subject.save

    duplicate = FactoryBot.build(:field_setting, custom_id: '', source: subject.source, stage: subject.stage)
    expect(duplicate).to be_valid
  end
end