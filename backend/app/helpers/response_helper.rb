module ResponseHelper
  def success_response(data={})
    render status: 200, json: {data: data}
  end

  def error_response(key, error_message=nil, error_data={})
    render_content = ErrorResponse.to_api(key, error_message).deep_dup
    render_content[:json].merge!(error_data) if error_data.present?
    render_content[:json].delete('app_code')
    render_content[:json]['error_message'] ||= key if render_content[:json]['error_code'] == 500000
    render(render_content)
  end

  def serialize_response(serializer_name, resource, **options)
    serializer_class = set_serializer_class(serializer_name)
    data = set_data(serializer_class, resource, options)
    success_response(data)
  end

  def set_serializer_class(serializer_name)
    serializer_class_name = "#{serializer_name.to_s.camelize}Serializer"
    if controller_path.nil?
      serializer_class = serializer_class_name
    else
      controller_name = controller_path.classify
      serializer_class = controller_name.gsub(/Api::(\w+)::\S+$/, "Api::#{'\1'}::#{serializer_class_name}")
    end
    serializer_class.safe_constantize
  end

  def set_data(serializer_class, resource, options)
    case serializer_class.superclass.name
    when 'GrapeSerializer'
      serializer = serializer_class.new(current_member: current_member)
    when 'BaseSerializer'
      serializer = serializer_class
      options[:current_member] = current_member
    end
    serializer.represent(resource, options)
  end
end
