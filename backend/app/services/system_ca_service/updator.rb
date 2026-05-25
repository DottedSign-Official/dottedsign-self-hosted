module SystemCaService
  class Updator < ServiceCaller
    def initialize(system_ca, ca_info = {})
      @system_ca = system_ca
      @ca_info = ca_info
    end

    def call
      check_ca
      filter_empty_params
      ActiveRecord::Base.transaction do
        update_system_ca
        validate_functionality
      end
      @result = @system_ca
    end

    private
    def check_ca
      raise ServiceError.new(:system_ca_not_found) if @system_ca.nil?
    end

    def filter_empty_params
      @ca_info = @ca_info.select do |key, value|
        value.present?
      end
    end

    def validate_functionality
      validator = Validator.call(@system_ca)
      raise ServiceError.new(validator.error.key) if validator.failed?
    end

    def update_system_ca
      @system_ca.update(@ca_info.slice(*SystemCa.column_names))
    end
  end
end