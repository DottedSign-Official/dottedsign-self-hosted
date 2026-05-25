class Api::V1::FormTaskSerializer < GrapeSerializer
  entity Api::V1::FormTaskEntity

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
      taggings: [
        :tag
      ]
    ]
  end
end
