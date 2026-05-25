class Template
  module Displayable
    extend ActiveSupport::Concern

    include SettingDisplayable

    class_methods do
      def display_infos(member_id, **display_options)
        member_tag_list = ActsAsTaggableOn::Tagging.tag_list_for_member(member_id)
        with_display_content.map do |template|
          info = template.display(member_id, **display_options)
          tag_info = member_tag_list.dup
          template.taggings.each do |tagging|
            next unless tagging.tagger_id == member_id
            tag_info[tagging.tag.name] = true
          end
          info[:tags] = tag_info
          info
        end
      end
    end

    def display(member_id, **display_options)
      info = {
        template_id: id,
        file_name: file_name,
        owner_id: owner_id,
        has_order: has_order,
        status: status,
        code: code,
        created_at: created_at.to_i,
        thumbnail: original_file&.download_link(attach_type: 'thumbnail', will_expired: false),
        share_info: share_info(member_id),
        over_attachment_limit: false
      }

      with_xfdf = display_options.delete(:with_xfdf)
      info[:detail] = dummy_stages.map do |stage|
        stage.display(member_id, with_xfdf: with_xfdf)
      end

      info.merge(extra_display_info(member_id, **display_options))
    end

    def share_info(member_id)
      {
        share_by_me: owner_id == member_id && self.share_settings.present?,
        share_by_others: owner_id != member_id
      }
    end

    def sample_header
      csv_headers = ['document.title', 'custom.message']
      dummy_stages.count.times do |signer_index|
        signer_num = signer_index + 1
        csv_headers += ["signer#{signer_num}.name", "signer#{signer_num}.email"]
      end
      csv_headers.join(',') + "\n"
    end

    private

    def extra_display_info(member_id, with_download_link: false, with_upload_link: false, with_tag: false)
      info = {}
      info[:download_link] = original_file&.download_link if with_download_link
      info[:upload_link] = upload_link_for('original') if with_upload_link
      info[:tags] = tag_info_for(member_id) if with_tag
      info
    end

  end
end
