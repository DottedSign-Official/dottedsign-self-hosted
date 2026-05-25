class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  scope :recent, -> { order(updated_at: :desc) }

  PER_PAGE = 10

  class << self

    def safe_find_or_create_by(**hsh, &block)
      find_by(hsh) || create(hsh, &block)
    rescue ActiveRecord::RecordNotUnique
      retry
    end

  end

  def strict_boolean(boolean_value)
    ActiveModel::Type::Boolean.new.cast(boolean_value)
  end

  def hex_to_bin(hex_content)
    hex_content.scan(/../).map { |x| x.hex.chr }.join
  end

end
