class Api::V1::FormTaskListSerializer < GrapeSerializer
  entity Api::V1::FormTaskListEntity

  protected

  def association_array
    [
      :owner,
      :task_setting,
      :uploaded_files,
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
        :source
      ],
      taggings: [
        :tag
      ]
    ]
  end
end
