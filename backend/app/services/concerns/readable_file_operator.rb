module ReadableFileOperator
  include CommandExecute

  IMPORT_CMD = "#{Settings.pdf_tool_path} xfdf -c %{cache_dir} %{font_opts} import form_to_annot %{imported_file} %{xfdf_file}".freeze

  def import_xfdf(stage, imported_file, working_dir, except_field_object_ids = [])
    sub_elements = format_sub_elements(stage, imported_file, working_dir, except_field_object_ids)
    import_cmd = IMPORT_CMD % sub_elements
    import_res = execute_system_cmd(import_cmd)
    raise ServiceError.new(:command_execute_failed, error_msg: "run '#{import_cmd}' failed: #{import_res}") if command_failed?(import_res)
    remove_used_files(sub_elements)
  end

  def format_sub_elements(stage, imported_file, working_dir, except_field_object_ids = [])
    {
      imported_file: imported_file,
      xfdf_file: obtain_xfdf_file(stage, working_dir, except_field_object_ids),
      cache_dir: working_dir,
      font_opts: font_opts
    }
  end

  def obtain_xfdf_file(stage, working_dir, except_field_object_ids = [])
    xfdf_content = stage.xfdf_content
    xfdf_content.gsub!(/ width=\"\d*\.*\d*\"/, " width=\"0.000000\"")
    xfdf_content.gsub!(/ background-color=\"#\w*\"/, "")
    xfdf_file_path = "#{working_dir}/stage_#{stage.id}.xfdf"
    xfdf_xml = Nokogiri::XML(xfdf_content)
    except_field_object_ids.each do |field_object_id|
      xfdf_xml.xpath("//*[@fieldname=\"#{field_object_id}\"]")[0].remove
    end

    File.open(xfdf_file_path, 'w+') { |file| file.write(xfdf_xml.to_xml) }
    xfdf_file_path
  end

  def remove_used_files(command_elements)
    File.unlink(command_elements[:xfdf_file])
  end

  def font_opts
    if Settings.pdf_font_folder.enable
      "-fd #{Rails.root.join(Settings.pdf_font_folder.path).to_s}"
    else
      "-fp #{Settings.pdf_font.path} -fn #{Settings.pdf_font.name}"
    end
  end
end
