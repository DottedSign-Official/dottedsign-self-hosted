class Font
  attr_reader :file

  def initialize(font_path)
    @file = TTFunk::File.open(font_path)
  end

  def width_of(string, font_size)
    string.each_char.map { |char| character_width(char, font_size) }.inject { |sum, x| sum + x }
  end

  def character_width(character, font_size)
    scale_factor = font_size.to_f / units_per_em
    width_in_units = horizontal_metrics.for(glyph_id(character)).advance_width
    width_in_units.to_f * scale_factor
  end

  def units_per_em
    @u_per_em ||= file.header.units_per_em
  end

  def horizontal_metrics
    @hm = file.horizontal_metrics
  end

  def glyph_id(character)
    character_code = character.unpack("U*").first
    file.cmap.unicode.first[character_code]
  end
end