class ChangeVerifyMethodToStagePolymorphic < ActiveRecord::Migration[6.1]
  def up
    add_column :verify_methods, :stage_type, :string
    add_column :verify_methods, :stage_id, :integer

    ActiveRecord::Base.transaction do
      say_with_time 'Updating stage_id and stage_type' do
        VerifyMethod.all.in_batches.each_record do |verify_method|
          verify_method.update!(stage_id: verify_method.sign_stage_id, stage_type: 'SignStage')
        end
      end
    end

    remove_index :verify_methods, column: :sign_stage_id
    remove_index :verify_methods, column: [:sign_stage_id, :uuid]
    remove_index :verify_methods, name: :verify_step_unique_index
    remove_column :verify_methods, :sign_stage_id, :integer

    add_index :verify_methods, [:stage_type, :stage_id]
    add_index :verify_methods, [:stage_type, :stage_id, :uuid]
    add_index :verify_methods, [:execute_type, :stage_type, :stage_id, :sequence], name: :verify_step_index
  end

  def down
    add_column :verify_methods, :sign_stage_id, :integer, null: true

    ActiveRecord::Base.transaction do
      say_with_time 'Updating stage_id and stage_type' do
        VerifyMethod.where(stage_type: 'SignStage').in_batches.each_record do |verify_method|
          verify_method.update!(sign_stage_id: verify_method.stage_id)
        end
        VerifyMethod.where(stage_type: 'DummyStage').destroy_all
      end
    end

    remove_index :verify_methods, column: [:stage_type, :stage_id]
    remove_index :verify_methods, column: [:stage_type, :stage_id, :uuid]
    remove_index :verify_methods, name: :verify_step_index

    remove_column :verify_methods, :stage_type, :string
    remove_column :verify_methods, :stage_id, :integer

    add_index :verify_methods, :sign_stage_id
    add_index :verify_methods, [:sign_stage_id, :uuid]
    add_index :verify_methods, [:execute_type, :sign_stage_id, :verify_type, :sequence], name: :verify_step_unique_index
  end
end
