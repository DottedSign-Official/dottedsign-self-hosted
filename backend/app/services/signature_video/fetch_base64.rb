module SignatureVideo
  class FetchBase64 < ServiceCaller

    def initialize(signature_id)
      @working_path = Settings.create_cache_working_dir
      @file_path = "#{@working_path}/video.mp4"
      @signature_id = signature_id
    end

    def call
      fetch_signature
      @result = fetch_signature_video
    ensure
      FileUtils.rm_rf(@working_path) if @working_path.present?
    end

    private

    def fetch_signature
      @signature = Signature.find_by(id: @signature_id)
      raise ServiceError.new("signature not found") unless @signature.present?
    end

    def fetch_signature_video
      @signature.service_files.each do |service_file|
        service_file.download_to_local(@file_path) if service_file.label == 'signature_video'
      end
      Base64.strict_encode64(File.read(@file_path))
    end
  end
end
