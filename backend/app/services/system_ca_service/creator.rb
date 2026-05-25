module SystemCaService
  class Creator < ServiceCaller
    def initialize(group, ca_info = {})
      @group = group
      @ca_info = ca_info
    end

    def call
      check_group
      ActiveRecord::Base.transaction do
        create_system_ca
        validate_functionality
      end
    end

    private
    def check_group
      raise ServiceError.new(:group_not_found) if @group.nil?
    end

    def validate_functionality
      validator = Validator.call(@result)
      raise ServiceError.new(validator.error.key) if validator.failed?
    end

    def create_system_ca
      @result = @group.system_cas.create(@ca_info.slice(*SystemCa.column_names))
    end
  end
end