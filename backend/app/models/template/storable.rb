class Template
  module Storable
    extend ActiveSupport::Concern

    include ShareStorable

    included do
      has_many :service_files, as: :storable, dependent: :destroy
      has_many :uploaded_files, -> {uploaded}, as: :storable, class_name: 'ServiceFile'
      has_one :original_file, -> {uploaded.where(label: 'original')}, as: :storable, class_name: 'ServiceFile'
      has_one :full_file, -> {uploaded.where(label: 'full')}, as: :storable, class_name: 'ServiceFile'
    end

  end
end
