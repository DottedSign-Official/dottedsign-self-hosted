class Api::V1::CombinationListSerializer < BaseSerializer
  entity Api::V1::CombinationListEntity

  protected

  def association_array
    [
      dummy_stages: [
        :stage_setting
      ]
    ]
  end
end
