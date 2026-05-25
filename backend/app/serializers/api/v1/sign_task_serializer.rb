class Api::V1::SignTaskSerializer < BaseSerializer
  entity Api::V1::SignTaskEntity

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
        :field_setting_groups,
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
