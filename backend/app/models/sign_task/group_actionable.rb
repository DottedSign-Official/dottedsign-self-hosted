class SignTask
  module GroupActionable
    extend ActiveSupport::Concern

    def allowed_group_to_download_task?(member)
      owned_by_group?(member) || acted_by_group?(member)
    end

    def allowed_group_to_download_audit?(member)
      owned_by_group?(member) || acted_by_group?(member)
    end

    def allowed_group_to_download_attachment?(member)
      return true if owned_by_group?(member)
      return false unless acted_by_group?(member)
      # check stage advanced setting
      true
    end

  end
end
