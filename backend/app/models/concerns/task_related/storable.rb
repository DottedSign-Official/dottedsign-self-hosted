module TaskRelated::Storable
  extend ActiveSupport::Concern

  include ShareStorable

  included do
    has_many :service_files, as: :storable, dependent: :destroy
    has_many :uploaded_files, -> { uploaded }, as: :storable, class_name: 'ServiceFile'
    has_one :original_file, -> { uploaded.where(label: 'original') }, as: :storable, class_name: 'ServiceFile'
    has_one :completed_file, -> { uploaded.where(label: 'completed') }, as: :storable, class_name: 'ServiceFile'
    has_one :audit_trail_file, -> { uploaded.where(label: 'audit_trail') }, as: :storable, class_name: 'ServiceFile'
    has_one :signature_compressed_file, -> { uploaded.where(label: 'signature_compressed') }, as: :storable, class_name: 'ServiceFile'
  end
end
