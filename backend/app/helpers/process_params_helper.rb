module ProcessParamsHelper

  def process_source_params_for(sign_type)
    params[:owner_id] = current_member.id
    params[:group_id] = current_member.active_group_id
    params[:sign_type] = sign_type
    params[:has_order] = strict_boolean(params[:has_order]) if params[:has_order].present?
  end

end