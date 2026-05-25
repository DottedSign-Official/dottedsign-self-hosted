module Developer
  class ShowMemberList < ServiceCaller
    def initialize(search_email, filter_status, filter_none_group, search_group_name, page, per_page)
      @search_email = search_email
      @filter_status = filter_status
      @filter_none_group = ActiveRecord::Type::Boolean.new.serialize(filter_none_group)
      @search_group_name = search_group_name
      @page = page || 1
      @per_page = per_page || Member::PER_PAGE
    end

    def call
      members = Member.includes(:profile, :roles)
      members = apply_email_filter(members) if @search_email.present?
      members = apply_status_filter(members) if @filter_status.present?
      members = apply_none_group_filter(members) if @filter_none_group
      members = apply_group_name_filter(members) if @search_group_name.present?
      @result = paginate_members(members)
    end

    private

    def apply_email_filter(members)
      members.where("email ILIKE ?", "%#{@search_email}%")
    end

    def apply_status_filter(members)
      members.where(status: @filter_status)
    end

    def apply_none_group_filter(members)
      members.where(group_id: nil)
    end

    def apply_group_name_filter(members)
      group_ids = Group.where(name: @search_group_name).pluck(:id)
      members.where(group_id: group_ids)
    end

    def paginate_members(members)
      members.page(@page).per(@per_page)
    end
  end
end
