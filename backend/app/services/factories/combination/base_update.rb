class Factories::Combination::BaseUpdate < Factories::Combination::Base
  def initialize(member, combination, combination_attrs)
    super(member, combination_attrs)
    @combination = combination
  end

  def call
    ActiveRecord::Base.transaction do
      update_combination
      if @combination_attrs[:stages].present?
        clear_dummy_stages
        create_dummy_stages
        set_combination_quantity
      end
    end
    @combination.save
    @combination.reload
    @result = @combination
  end

  protected

  def update_combination
    @combination.assign_attributes(@combination_attrs.slice(:name, :description, :has_order))
  end

  def clear_dummy_stages
    @combination.dummy_stages.destroy_all
  end

  def set_combination_quantity
    @combination.quantity = @combination_attrs[:stages].length
  end
end
