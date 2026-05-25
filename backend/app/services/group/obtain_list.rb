class Group::ObtainList < ServiceCaller
  def initialize(search_group_name, page, per_page)
    @search_group_name = search_group_name
    @page = page || 1
    @per_page = per_page || Group::PER_PAGE
  end

  def call
    @groups = Group.active.all
    @groups = groups.where("name ILIKE ?", "%#{@search_group_name}%") if @search_group_name.present?
    @groups = @groups.page(@page).per(@per_page)
    @result = @groups
  end

end
