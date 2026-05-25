class Profile < ApplicationRecord
  belongs_to :member

  before_save :process_language

  validates :language, inclusion: { in: %w(en zh-TW) }

  VALID_LANG = ['en', 'zh-TW'].freeze

  class << self
    def default_icon_url
      ServiceFile.find_by(storable_type: 'Image', label: 'default_avatar')&.download_link(attach_type: 'file', will_expired: false)
    end
  end

  def public_info(only: [])
    if only.blank?
      info = as_json(except: [:icon_url, :created_at, :updated_at])
      info['icon_url'] = display_icon_url
    else
      info = as_json(only: only, except: [:created_at, :updated_at])
      info['icon_url'] = display_icon_url if only.include?(:icon_url)
    end
    info
  end

  def display_icon_url
    icon_url % {server_host: Settings.host} if icon_url.present?
  end

  private

  def process_language
    self.language = LangHandle.i18n_accept_lang(language)
  end

end
