class Api::V1::TagsController < Api::ApplicationController
  before_action :setup_member_tags, only: [:create, :modify, :remove, :manage]
  before_action :check_tag!, only: [:create, :modify]
  before_action :check_tag_ownership, only: [:manage]
  before_action :setup_taggable_targets, only: [:manage]

  def index
    list = current_member.tag_list_with_order(search_tag_name: params[:search_name])
    success_response(list)
  end

  def create
    @member_tags.add(params[:new_tag])
    list = tag_list_do_change!
    success_response(list)
  end

  def modify
    old_taggings = current_member.taggings.or(current_member.owned_taggings).joins(:tag).where(tags: {name: params[:old_tag]})
    return error_response(:tag_not_found) if old_taggings.blank?

    new_tag = ActsAsTaggableOn::Tag.find_or_create_by(name: params[:new_tag])
    old_taggings.update_all(tag_id: new_tag.id)

    success_response(current_member.tag_list_with_order)
  end

  def remove
    @member_tags.remove(params[:remove_tag])
    current_member.owned_taggings.joins(:tag).where(tags: {name: params[:remove_tag]}).destroy_all
    list = tag_list_do_change!
    success_response(list)
  end

  def manage
    @taggable_targets.each do |target|
      target.update_tags_by(current_member, add_tags: manage_params[:add_tags].to_a, remove_tags: manage_params[:remove_tags].to_a)
    end
    @taggable_targets.each(&:reload)
    serialize_response(:taggable, @taggable_targets, tagger: current_member)
  end

  def move_behind
    tag = current_member.taggings.joins(:tag).find_by(tags: {name: params[:move_tag]})
    return error_response(:tag_not_found) if tag.nil?
    if tag.move_behind(params[:behind_tag])
      success_response(current_member.tag_list_with_order)
    else
      error_response(:tag_move_failed)
    end
  end

  private

  def tag_list_do_change!
    current_member.save
    current_member.reload
    current_member.tag_list_with_order
  end

  def manage_params
    return @manage_params if @manage_params
    @manage_params = params.permit(:taggable_type, add_tags: [], remove_tags: [])
    if @manage_params[:taggable_type] == 'Batch'
      @manage_params[:taggable_id] = params.require(:taggable_id).permit(task_ids: [], envelope_ids: [])
    else
      @manage_params[:taggable_id] = [params[:taggable_id]].flatten
    end
    @manage_params
  end

  def setup_member_tags
    @member_tags = current_member.tag_list
  end

  def check_tag!
    return error_response(:tag_name_is_too_long) if params[:new_tag].length > TAG_MAX_LENGTH
    return error_response(:empty_tag_not_allowed) if params[:new_tag].blank?
    error_response(:tag_already_exist) if @member_tags.include?(params[:new_tag])
  end

  def check_tag_ownership
    manage_tags = (manage_params[:add_tags].to_a + manage_params[:remove_tags].to_a).uniq
    error_response(:tag_not_own) if manage_tags.any? { |tag| @member_tags.exclude?(tag) }
  end

  def setup_taggable_targets
    return error_response(:taggable_not_found) if manage_params[:taggable_type].nil? || manage_params[:taggable_id].blank?

    taggable_type = manage_params[:taggable_type].camelize
    case taggable_type
    when 'Batch'
      batch_taggable_targets
    when 'SignTask', 'Envelope', 'Template'
      single_type_taggable_targets(taggable_type)
    else
      return error_response(:not_taggable)
    end
    error_response(:taggable_not_found) if @taggable_targets.blank?
  end

  def batch_taggable_targets
    taggable_sign_task_ids = manage_params.dig(:taggable_id, :task_ids) & SignTask.related_ids(current_member)
    taggable_envelope_ids = manage_params.dig(:taggable_id, :envelope_ids) & Envelope.related_ids(current_member)
    @taggable_targets = SignTask.where(id: taggable_sign_task_ids) + Envelope.where(id: taggable_envelope_ids)
  end

  def single_type_taggable_targets(taggable_type)
    target_class = taggable_type.safe_constantize
    return error_response(:not_taggable) if target_class.nil?
    taggable_ids = [manage_params[:taggable_id]].flatten.map(&:to_i) & target_class.related_ids(current_member)
    @taggable_targets = target_class.where(id: taggable_ids)
  end
end
