class Api::V1::DeveloperTaskListSerializer < BaseSerializer
  entity Api::V1::DeveloperTaskListEntity

  protected

  def association_array
    [
      :group,
      :owner,
      :task_setting,
      :original_file,
      :completed_file,
      :modified_events,
      sign_stages: [
        :actor,
        :stage_setting,
        field_settings: [
          stage: [
            :xfdf_document
          ]
        ]
      ],
      dummy_stages: [
        :actor,
        :target
      ],
      taggings: [
        :tag
      ]
    ]
  end
end
