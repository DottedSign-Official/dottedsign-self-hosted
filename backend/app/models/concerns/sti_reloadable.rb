module StiReloadable
  extend ActiveSupport::Concern

  # copy from Rails 6.1.7.6 ActiveRecord::Persistence to handle STI
  def sti_reload!(*args)
    self.class.connection.clear_query_cache

    fresh_object =
      if args.present? && args[0][:lock]
        self.class.unscoped { self.class.base_class.lock(args[0][:lock]).find(id) }
      else
        self.class.unscoped { self.class.base_class.find(id) }
      end

    type_name = fresh_object.send(self.class.inheritance_column)
    klass = self.class.respond_to?(:find_sti_class) ? self.class.base_class.find_sti_class(type_name) : self.class
    if klass != self.class
      return klass.new.tap do |object|
        object.instance_variable_set(:@attributes, fresh_object.instance_variable_get(:@attributes))
        object.instance_variable_set(:@new_record, false)
        object.instance_variable_set(:@previously_new_record, false)
      end
    else
      @attributes = fresh_object.instance_variable_get(:@attributes)
      @new_record = false
      @previously_new_record = false
      return self
    end
  end
end
