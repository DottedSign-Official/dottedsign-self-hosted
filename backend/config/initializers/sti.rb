Rails.application.config.after_initialize do

  ActiveRecord::Base.descendants.each do |model_class|
    next unless model_class.respond_to?(:load_sti_helpers)
    model_class.load_sti_helpers rescue nil
  end
end
