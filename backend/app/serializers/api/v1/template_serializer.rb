class Api::V1::TemplateSerializer < GrapeSerializer
  entity Api::V1::TemplateEntity

  protected

  def association_array
    [
      :owner,
      :uploaded_files,
      dummy_stages: [
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
