class MockService < ServiceCaller
  def initialize(**kwargs)
    kwargs.each do |key, value|
      (class << self; self; end).send(:attr_reader, key.to_sym)
      instance_variable_set("@#{key}", value)
    end
  end

  def call; end
end
