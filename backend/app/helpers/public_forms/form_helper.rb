module PublicForms::FormHelper
  def process_form_params
    params[:goal_num] = params[:goal_num].present? ? params[:goal_num].to_i : -1
    params[:end_at] = params[:end_at].present? ? minute_precision_epoch(params[:end_at].to_i) : -1
  end

  def signer_info
    {
      name: params[:signer_name],
      email: params[:signer_email]
    }
  end

  private

  def minute_precision_epoch(raw_epoch)
    return -1 if raw_epoch == -1
    Time.zone.at(raw_epoch).change(sec: 0).to_i
  end
end
