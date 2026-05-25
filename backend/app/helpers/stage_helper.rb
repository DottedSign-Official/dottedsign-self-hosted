module StageHelper

  def setup_stage
    if params[:envelope_id].present?
      @stage = SignStage.find_by(sequence: DummyStage.find_by(id: params[:stage_id])&.sequence)
    else
      @stage = SignStage.find_by(id: params[:stage_id])
    end
    error_response(:stage_not_found) if @stage.nil?
  end

end
