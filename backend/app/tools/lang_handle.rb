class LangHandle

  PAGE_AVAILABLE_LANG = %w(en zh-tw zh-cn ja).freeze

  LANG_MAPPING = {
    'zh-hant' => 'zh-TW',
    'zh-Hant' => 'zh-TW',
    'zh-hans' => 'zh-CN',
    'zh-Hans' => 'zh-CN'
  }.freeze

  MAIL_LANG_MAPPING = {
    'zh-tw' => 'hant',
    'zh-hk' => 'hant',
    'zh-cn' => 'hans',
    'jp' => 'ja',
    'fa' => 'fr'
  }.freeze

  class << self
    def mail_lang_mapping(lang)
      return 'en' unless lang.present?
      lang = downcase_lang(lang)
      lang = MAIL_LANG_MAPPING[lang] || lang
      I18n.locale_available?(lang) ? lang : 'en'
    end

    def downcase_lang(lang)
      LANG_MAPPING[lang] || lang.downcase
    end

    def upcase_lang(lang)
      map_lang = LANG_MAPPING[lang]
      return map_lang if map_lang.present?
      lang_code, country_code = lang.split('-')
      country_code = country_code&.upcase
      [lang_code, country_code].compact.join('-')
    end

    def i18n_accept_lang(lang)
      lang = upcase_lang(lang)
      return lang if I18n.locale_available?(lang)
      lang_code, country_code = lang.split('-')
      I18n.locale_available?(lang_code) ? lang_code : Settings.default.lang
    end
  end

end
