class Stage < ApplicationRecord
  self.abstract_class = true
  self.inheritance_column = :action

  include Actionable
  include Callbackable
  include Displayable
  include StiReloadable
  include Storable

  class << self
    # built-in class method to bind subclass in STI before storing record
    def sti_name
      self.name.demodulize.underscore
    end

    # built-in class method to bind subclass in STI after finding record
    def find_sti_class(type_name)
      module_name = self.name.deconstantize.presence || "#{self.name}s"
      type_name = "#{module_name}::#{type_name.camelize}"
      super
    end

    # custom method called in initializer
    def load_sti_helpers
      action_classes = {}
      descendants.each do |concrete_class|
        concrete_class.descendants.each do |concrete_action_class|
          action_name = concrete_action_class.name.demodulize.underscore
          action_classes[action_name] ||= []
          action_classes[action_name] << concrete_action_class
        end
      end
      action_classes.each do |action_name, concrete_action_classes|
        define_method("action_#{action_name}?") do
          concrete_action_classes.any? { |concrete_action_class| is_a?(concrete_action_class) }
        end

        scope "action_#{action_name}", -> {
          where(self.inheritance_column => concrete_action_classes.map { |concrete_action_class| concrete_action_class.name.demodulize.underscore })
        }
      end
    end
  end

  def format_stage_attachment_settings(attachment_settings,viewable_attachment_id_map = {})
    attachment_settings.each_with_index do |setting, setting_index|
      setting[:force] = ActiveModel::Type::Boolean.new.cast(setting[:force]) || false
      setting[:viewable_in_processing] = ActiveModel::Type::Boolean.new.cast(setting[:viewable_in_processing]) || false
      original_attachment_id = setting[:attachment_id]
      setting[:attachment_id] = generate_new_attachment_id(setting_index)
      viewable_attachment_id_map[original_attachment_id] = setting[:attachment_id] if setting[:viewable_in_processing]
    end
    self.update!(attachment_setting: attachment_settings)
    viewable_attachment_id_map
  end

  def reset_attachment_ids!
    id_map = {}
    new_settings = self.attachment_setting.map.with_index do |setting, index|
      original_id = setting['attachment_id']
      new_id = generate_new_attachment_id(index)
      id_map[original_id] = new_id
      setting.merge('attachment_id' => new_id)
    end
    self.update!(attachment_setting: new_settings)
    id_map
  end

  private

  def generate_new_attachment_id(index)
    "attachment_#{self.id}_#{index + 1}"
  end
end
