class TemplateShareList < ServiceCaller
  attr_reader :share_list, :self_template_groups_dictionary, :self_group_share_template_ids

  def initialize(member, filter_type, page = 1, per_page = ShareSetting::PER_PAGE)
    @member = member
    @filter_type = filter_type
    @page = page
    @per_page = per_page
  end

  def call
    obtain_group
    obtain_self_group_share_template_ids
    obtain_self_share_list
    obtain_self_template_groups_dictionary
    obtain_share_list
  end

  private

  def obtain_group
    @group = Group.includes(:members, members: [:templates]).find_by(id: @member.active_group_id)
    raise ServiceError.new(:group_not_found) if @group.nil?
  end

  def obtain_self_group_share_template_ids
    @self_group_share_template_ids = @group.members.map { |member| member.templates.pluck(:id) }.flatten
  end

  def obtain_self_share_list
    @self_share_list = ShareSetting.includes(:shared).where(shared_type: "Template", shared_id: @self_group_share_template_ids)
  end

  def obtain_self_template_groups_dictionary
    @self_template_groups_dictionary = @self_share_list.group_by { |share_setting| share_setting.shared_id }
  end

  def obtain_share_list
    case @filter_type
    when "self"
      @share_list = deduplication_self_share_list
    when "other"
      @share_list = obtain_other_share_list
    else
      @share_list = obtain_all_share_list
    end
    @share_list = @share_list.page(@page).per(@per_page)
  end

  def deduplication_self_share_list
    grouped_settings = @self_share_list.group_by { |share_setting| [share_setting.shared_type, share_setting.shared_id] }
    share_list_ids = grouped_settings.values.map { |settings| settings.first.id }
    ShareSetting.includes(:shared).where(id: share_list_ids)
  end

  def obtain_other_share_list
    ShareSetting.includes(:shared).where.not(shared_type: "Template", shared_id: @self_group_share_template_ids).where(target: @group)
  end

  def obtain_all_share_list
    deduplication_self_share_list.or(obtain_other_share_list)
  end

end
