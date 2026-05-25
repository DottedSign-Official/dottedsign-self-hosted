class CountryInfo < ApplicationRecord

  DEFAULT_LANG = Settings.default.lang
  LANG_MAP = {
    'zh-TW' => 'zh-Hant',
    'zh-CN' => 'zh-Hans',
    'ja-JP' => 'ja'
  }.freeze

  class << self

    def list(lang=DEFAULT_LANG)
      lang = LangHandle.upcase_lang(lang)
      info = []
      all.each do |country_info|
        info += country_info.display_info(lang)
      end
      info
    end

  end

  def display_info(lang)
    calling_code.split(' & ').map do |code|
      {
        name: display_name(lang),
        alpha2: alpha2,
        alpha3: alpha3,
        calling_code: code
      }
    end
  end

  def display_name(lang)
    lang = LANG_MAP[lang] || lang
    translations[lang] || translations[DEFAULT_LANG]
  end

end
