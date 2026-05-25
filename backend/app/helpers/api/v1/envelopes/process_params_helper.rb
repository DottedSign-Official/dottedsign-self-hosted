module Api::V1::Envelopes::ProcessParamsHelper

  def process_envelope_params
    process_source_params_for('create_and_invite')
    params[:stages]&.each do |stage_info|
      stage_info[:actor_info] = stage_info.slice(:email, :name)
    end
  end

  def process_task_params
    process_source_params_for('create_and_invite')
    params[:task_infos] = build_task_infos
  end

  private

  def build_task_infos
    return [] if params[:file_list].blank?
    params[:file_list].each_with_object([]) do |file, task_infos|
      task_infos << build_task_info(file)
    end
  end

  def build_task_info(file)
    task_info = params.slice(:owner_id, :group_id, :sign_type, :has_order)
    task_info[:task_id] = file[:task_id]
    task_info[:envelope_file_id] = file[:envelope_file_id]
    task_info[:file_name] = file[:file_name]
    task_info[:file_info] = file.slice(*file_info_permit_attrs)
    task_info[:stages] = build_stage_infos(file)
    task_info.compact
  end

  def build_stage_infos(file)
    return [] if params[:stages].blank?
    params[:stages].each_with_object([]) do |stage, stage_infos|
      stage_infos << build_stage_info(stage, file)
    end
  end

  def build_stage_info(stage_params, file)
    stage_info = stage_params.deep_dup
    matched_xfdf_info = match_stage_info(:xfdf_info, stage_info, file)
    matched_object_ids = matched_xfdf_info.map { |xfdf| xfdf[:object_id] }
    raise ServiceError.new(:invalid_object_id) if (matched_object_ids - stage_info[:pdf_object_info]).present?

    stage_info[:pdf_object_info] = matched_object_ids
    stage_info[:xfdf_info] = matched_xfdf_info
    stage_info[:attachment_setting] = match_stage_info(:attachment_setting, stage_info, file)
    stage_info[:field_setting_groups] = match_stage_info(:field_setting_groups, stage_info, file)
    stage_info[:verify] ||= [{ verify_type: 'signer_detect' }] if params[:need_otp_verify]
    stage_info.compact
  end

  def match_stage_info(key, stage, file)
    stage[key]&.select do |item|
      item[:envelope_file_id].present? ? item[:envelope_file_id] == file[:envelope_file_id] : item[:task_id] == file[:task_id]
    end
  end

end
