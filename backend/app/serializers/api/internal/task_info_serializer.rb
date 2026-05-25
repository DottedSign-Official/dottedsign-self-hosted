class Api::Internal::TaskInfoSerializer < BaseSerializer
  entity Api::Internal::TaskInfoEntity

  protected

  def association_array
    [
      :owner,
      sign_stages: [
        :actor,
        :field_settings,
      ]
    ]
  end
end
