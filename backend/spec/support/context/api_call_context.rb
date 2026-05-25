RSpec.shared_context 'api_call' do

  def call_api(http_method, path, params, headers)
    case http_method
    when :get, 'get'
      send(:get, "#{path}?#{URI.encode_www_form(params)}", headers: headers)
    else
      send(http_method, path, params: params.to_json, headers: headers)
    end
  end

end
