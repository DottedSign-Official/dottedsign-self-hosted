module Groupable

  def group_id
    model_group_id = super
    GROUP_USE ? model_group_id : nil
  end

end
