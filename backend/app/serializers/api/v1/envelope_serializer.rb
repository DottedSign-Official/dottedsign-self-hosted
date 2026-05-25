class Api::V1::EnvelopeSerializer < BaseSerializer
  entity Api::V1::EnvelopeEntity

  protected

  def association_array
    [
      :group,
      :owner,
      :envelope_setting,
      :original_file,
      :completed_file,
      :modified_events,
      dummy_stages: [
        :actor,
        :stage_setting
      ],
      sign_tasks: [
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
        taggings: [
          :tag
        ]
      ],
      taggings: [
        :tag
      ]
    ]
  end
end
