# frozen_string_literal: true

class BaseSerializer

  class << self
    attr_reader :entity_class

    def entity(entity_class)
      @entity_class ||= entity_class
    end

    def represent(resource, opts = {})
      serializer = new(resource, opts)
      serializer.represent
    end

  end

  def initialize(resource, options={})
    @resource = resource
    @options = options
  end

  def represent
    preload_associations if @resource.is_a?(ActiveRecord)
    self.class.entity_class.represent(@resource, @options).as_json
  end

  protected

  def preload_associations
    ActiveRecord::Associations::Preloader.new.preload(@resource, association_array)
  end

  def association_array
  end

end
