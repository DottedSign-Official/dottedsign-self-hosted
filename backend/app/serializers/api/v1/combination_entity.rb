class Api::V1::CombinationEntity < BaseEntity
  expose :id, as: :combination_id
  expose :name
  expose :description
  expose :has_order
  expose :quantity

  expose :created_at do |combination|
    combination.created_at.to_i
  end

  expose :stage_entities, as: :details

  expose :share_info, if: { batch: true }

  private

  alias :combination :object

  def stage_entities
    return @stage_entities if @stage_entities.present?
    @stage_entities = Api::V1::CombinationStageEntity.represent(combination.dummy_stages, options)
  end

  def share_info
    combination.share_info(options[:current_member])
  end
end
