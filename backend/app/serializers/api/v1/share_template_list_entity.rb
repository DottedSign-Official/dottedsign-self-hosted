class Api::V1::ShareTemplateListEntity < BaseEntity
  present_collection true

  expose :total_count
  expose :current_page
  expose :total_pages
  expose :shares

  private

  def pagination_items
    object[:items]
  end

  def shares
    pagination_items.map do |share_setting|
      {
        template_id: share_setting.shared_id,
        name: share_setting.shared.file_name,
        code: share_setting.shared.code,
        share_groups: share_groups(share_setting),
        self_group_share: options[:self_group_share_template_ids].include?(share_setting.shared_id),
      }
    end
  end

  def share_groups(share_setting)
    share_groups = options[:self_template_groups_dictionary][share_setting.shared_id]&.map { |self_share_setting| obtain_group_info(self_share_setting)}
    return [obtain_group_info(share_setting)] if share_groups.nil?
    share_groups
  end

  def obtain_group_info(share_setting)
    {
      group_id: share_setting.target_id,
      name: share_setting.target.name
    }
  end

  def total_count
    pagination_items.total_count
  end

  def current_page
    pagination_items.current_page
  end

  def total_pages
    pagination_items.total_pages
  end
end
