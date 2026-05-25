class Api::V1::SignatureSerializer < BaseSerializer
  entity Api::V1::SignatureEntity

  def association_array
    [
      :service_files
    ]
  end
end
