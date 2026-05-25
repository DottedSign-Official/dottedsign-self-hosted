module CoreExtensions
  module CustomDoorkeeperErrorResponse
    def body
      body = {
        error: name,
        error_description: description,
        state: state,
      }.reject { |_, v| v.blank? }
      body.merge(ErrorResponse.to_hash(name.to_sym))
    end
  end
end
