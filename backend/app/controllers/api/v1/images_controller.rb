# frozen_string_literal: true

class Api::V1::ImagesController < Api::ApplicationController
  include PublicForms::FormTokenAuthenticationHelper

  # authentication for quick sign (in CodeAuthenticationHelper)
  prepend_before_action :allow_code_authentication_strategy

  # authentication for form signer (in PublicForms::FormTokenAuthenticationHelper)
  prepend_before_action :allow_form_token_authentication_strategy

  before_action :security_checked
  before_action :check_acceptance!

  def create
    image = Image.setup(params.require(:raw))
    serialize_response(:image, image)
  end
end