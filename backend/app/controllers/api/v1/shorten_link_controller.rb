class Api::V1::ShortenLinkController < Api::ApplicationController
  include PublicForms::FormTokenAuthenticationHelper

  skip_before_action :setup_current_member, only: %i[show]

  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy, only: %i[create]

  # authentication for form signer (in PublicForms::FormTokenAuthenticationHelper)
  prepend_before_action :allow_form_token_authentication_strategy, only: %i[create]

  def show
    target_url = Rails.cache.read(cache_key(params[:uuid]))
    return error_response(:shorten_link_not_found) if target_url.nil?

    success_response(target_url: target_url)
  end

  def create
    uuid = SecureRandom.uuid
    Rails.cache.write(cache_key(uuid), params[:target_url], expires_in: 30.minutes)

    success_response(shorten_link: format_shorten_link(uuid))
  end

  private

  def cache_key(uuid)
    "shorten_link:#{uuid}"
  end

  def format_shorten_link(uuid)
    "#{Settings.branch_deep_link.web}/shorten_link/#{uuid}"
  end
end
