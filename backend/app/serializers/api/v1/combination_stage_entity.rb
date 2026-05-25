class Api::V1::CombinationStageEntity < BaseEntity
  expose :id, as: :stage_id
  expose :sequence
  expose :name
  expose :email
  expose :action
  expose :actor_info

  expose :full_info, merge: true, unless: { batch: true } do
    expose :stage_setting, using: Api::V1::StageSettingEntity
  end

  private

  alias :stage :object

  def name
    stage.actor_info['name']
  end

  def email
    stage.actor_info['email']
  end
end
