# spec/lib/on_premise_license/plan_reader_spec.rb
require 'rails_helper'
require 'on_premise_license/plan_reader'
require 'support/license_fixture_builder'

RSpec.describe OnPremiseLicense::PlanReader do
  let(:fixture) { LicenseFixtureBuilder.build(plan: 'enterprise') }

  before do
    stub_const('OnPremiseLicense::PlanReader::LICENSE_PATH', fixture[:license_path])
    stub_const('OnPremiseLicense::PlanReader::PUBLIC_PEM_PATH', fixture[:public_pem_path])
    described_class.reset!
  end

  after do
    LicenseFixtureBuilder.cleanup(fixture)
    described_class.reset!
  end

  describe '.plan' do
    it 'returns "enterprise" when license plan is enterprise' do
      expect(described_class.plan).to eq('enterprise')
    end
  end

  describe '.enterprise?' do
    it 'returns true' do
      expect(described_class.enterprise?).to be true
    end
  end

  context 'when license plan is not enterprise' do
    let(:fixture) { LicenseFixtureBuilder.build(plan: 'community') }

    it '.plan returns the plan string' do
      expect(described_class.plan).to eq('community')
    end

    it '.enterprise? returns false' do
      expect(described_class.enterprise?).to be false
    end
  end

  context 'when license file is missing' do
    before do
      stub_const('OnPremiseLicense::PlanReader::LICENSE_PATH', '/nonexistent/license.key')
      described_class.reset!
    end

    it '.enterprise? returns false' do
      expect(described_class.enterprise?).to be false
    end
  end

  context 'when public pem is missing' do
    before do
      stub_const('OnPremiseLicense::PlanReader::PUBLIC_PEM_PATH', '/nonexistent/public.pem')
      described_class.reset!
    end

    it '.enterprise? returns false' do
      expect(described_class.enterprise?).to be false
    end
  end

  context 'when license envelope is malformed' do
    before do
      bad = File.join(fixture[:dir], 'bad.key')
      File.write(bad, 'not-base64-or-json')
      stub_const('OnPremiseLicense::PlanReader::LICENSE_PATH', bad)
      described_class.reset!
    end

    it '.enterprise? returns false' do
      expect(described_class.enterprise?).to be false
    end
  end

  describe '.reset!' do
    it 'clears memoized plan so subsequent reads re-evaluate' do
      described_class.plan
      stub_const('OnPremiseLicense::PlanReader::LICENSE_PATH', '/nonexistent/license.key')
      described_class.reset!
      expect(described_class.plan).to be_nil
    end
  end
end
