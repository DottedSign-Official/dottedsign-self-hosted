module SystemCaMockHelper
  def mock_hsm_service
    allow(DigitalCertificate::Hsm).to receive(:apply_ap_cert).and_return({ 'status' => 200, 'code' => '0' })
  end
end