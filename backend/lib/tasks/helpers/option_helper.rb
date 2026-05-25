module OptionHelper
  private
  def change_default_value(params, key, value)
    params.each { |param| 
      next unless param[:key] == key 
      param[:default_value] = value
    }
  end

  def set_options(task, params)
    options = {}
    opts = get_parser(task, options, params)
  
    args = opts.order!(ARGV) {}
    opts.parse!(args)
    
    options[:content] = opts
  
    set_default_value(options, params)
    check_options(options, params)
    
    options
  end
  
  def get_parser(task, options, params=[])
    opts = OptionParser.new
    opts.banner = "Usage: rake:#{task} -- [options]"
  
    opts.on("-h", "--help") { |_| options[:show_help] = true }
    opts.on("--demo", "list all commands that is to be excuted") { |_| options[:demo] = true }
  
    params.each do |param|
      if param[:type] == :switch
        opts.on("-#{param[:s_key]}", "--#{param[:key]}", "#{param[:desc]}") { |_| 
          if param.key?(:option_key)
            options[param[:option_key]] = true 
          else
            options[param[:key]] = true 
          end
        }
      else
        opts.on("--#{param[:key]}=#{param[:key].upcase}", "#{param[:desc]} with default value: #{param[:default_value]}") { |value| 
          if param.key?(:option_key)
            options[param[:option_key]] = value 
          else
            options[param[:key]] = value 
          end
        }
      end
    end
  
    opts
  end

  def check_options(options, params)
    params.each do |param|
      key = param.key?(:option_key) ? param[:option_key] : param[:key]
      if param[:required] && options[key].blank?
        puts options[:content]
        raise "lack of required key #{param[:key]}" 
      end
    end
  end
  
  def set_default_value(options, params)
    params.each do |param|
      next if param[:tyep] == :switch
      key = param.key?(:option_key) ? param[:option_key] : param[:key]
      options[key] = param[:default_value] unless options.key?(key)
    end
  end
end