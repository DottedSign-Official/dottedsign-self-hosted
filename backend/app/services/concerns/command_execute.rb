module CommandExecute
  def execute_system_cmd(cmd)
    puts "[#{Time.zone.now}] execute cmd: #{cmd}"
    result = Open3.popen3(cmd) do |stdout, stderr, status, thread|
      status.read
    end
    puts "[#{Time.zone.now}] execute cmd done: #{result}"
    result.encode('UTF-8', invalid: :replace, undef: :replace).chomp
  end

  def command_success?(command_result, failed_regex: /error/)
    command_result.blank? || failed_regex.match(command_result).nil? || command_result.include?('Done')
  end

  def command_failed?(command_result, failed_regex: /error/)
    command_result.present? && failed_regex.match?(command_result) && command_result.exclude?('Done')
  end
end