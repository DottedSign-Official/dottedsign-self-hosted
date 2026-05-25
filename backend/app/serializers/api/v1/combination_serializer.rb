class Api::V1::CombinationSerializer < BaseSerializer
  entity Api::V1::CombinationEntity

  protected

  def association_array
    [
      dummy_stages: [
        :stage_setting
      ]
    ]
  end
end
