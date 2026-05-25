require 'resolv'

class MailCheck < ServiceCaller
  attr_reader :email, :domain

  # check_options can include:
  # - :domain: check if the domain exists
  # - :registration: check if the email is already registered
  def initialize(email, check_options: [])
    @email = email
    @check_options = check_options
  end

  def call
    check_for_format!
    check_for_domain_existence! if @check_options.include?(:domain)
    check_for_already_taken! if @check_options.include?(:registration)
    @result = { valid_email: @email, valid_domain: @domain }
  end

  private

  def check_for_format!
    format_result1 = @email =~ Member.email_regexp
    format_result2 = @email =~ URI::MailTo::EMAIL_REGEXP
    raise ServiceError.new(:email_format_invalid) if format_result1.nil? || format_result2.nil?
  end

  def check_for_domain_existence!
    @domain = @email.partition('@').last
    return if @domain == "kdanmobile.com"
    Resolv::DNS.open do |dns|
      mx = dns.getresources(@domain, Resolv::DNS::Resource::IN::MX)
      raise ServiceError.new(:invalid_domain) if mx.blank?
    end
  end

  def check_for_already_taken!
    member_with_mail = Member.registered.where(email: @email)
    raise ServiceError.new(:email_already_taken) if member_with_mail.present?
  end
end
