module SignatureVideo
  class ImageConvertMp4Base64 < ServiceCaller
    include CommandExecute

    COVERT_CMD = "ffmpeg -r 10 -i %{working_path}/%%05d.png -c:v libx264 -vf scale=720:480 -pix_fmt yuv420p %{working_path}/out.mp4".freeze

    def initialize(base64_images)
      @base64_images = base64_images
    end

    def call
      working_path = Settings.create_cache_working_dir
      save_png(@base64_images, working_path)
      @result = fetch_mp4_base64(working_path)
    end

    private

    def fetch_mp4_base64(working_path)
      cmd_info = { working_path: working_path }
      execute_system_cmd(COVERT_CMD % cmd_info)
      mp4_file = File.open("#{working_path}/out.mp4").read
      mp4_base64 = Base64.strict_encode64(mp4_file)
      FileUtils.rm_rf(working_path)
      raise ServiceError.new("base64 is null") unless mp4_base64.present?
      mp4_base64
    end

    def save_png(base64_images, working_path)
      base64_images.each_with_index do |base64_image, index|
        base64_image = remove_data_uri(base64_image)
        file_path = "#{working_path}/#{index.to_s.rjust(5, '0')}.png"
        File.open(file_path, "wb") { |f| f.write(Base64.decode64(base64_image)) }
      end
    end

    def remove_data_uri(image_base64)
      return image_base64 if image_base64.index(',').nil?
      image_index = image_base64.index(',') + 1
      image_base64[image_index..]
    end
  end
end
