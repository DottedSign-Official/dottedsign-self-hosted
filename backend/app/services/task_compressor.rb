require 'zip'

class TaskCompressor < ServiceCaller

  attr_reader :working_dir

  def initialize(task_ids, working_dir='tmp/compress')
    @task_ids = task_ids
    @working_dir = "#{working_dir}_#{Time.zone.now.to_i}"
    FileUtils.mkdir_p(@working_dir)
  end

  def call
    setup_tasks
    compress_files
    @result = @zip_file
  end

  private

  def setup_tasks
    @tasks = SignTask.completed.where(id: @task_ids).includes(:completed_file)
    raise ServiceError.new(:task_not_found) if @tasks.blank?
  end

  def compress_files
    @zip_file = "#{@working_dir}/compress.zip"
    Zip.unicode_names = true
    Zip::File.open(@zip_file, Zip::File::CREATE) do |zipfile|
      download_files do |file_name, file_path|
        zipfile.add(file_name, file_path)
      end
    end
  end

  def download_files(&block)
    files = Hash.new{|hash, key| hash[key] = 0}
    @tasks.each do |task|
      next if task.completed_file.nil?
      file_path = task.completed_file.download_to_local("#{@working_dir}/task_#{task.id}.pdf")
      next if file_path.nil?
      file_name = task.file_name.force_encoding('utf-8')
      files[file_name] += 1
      if files[file_name] > 1
        file_name = "#{file_name}_#{files[file_name]}"
        files[file_name] += 1
      end
      yield "#{file_name}.pdf", file_path
    end
  end

end
