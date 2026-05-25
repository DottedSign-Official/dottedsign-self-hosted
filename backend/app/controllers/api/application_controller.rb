class Api::ApplicationController < ApplicationController
  include AttributeHelper
  include CodeAuthenticationHelper
  include ProcessParamsHelper
  include StageHelper
  include StageSettingHelper
  include TaskHelper

  before_action :setup_current_member
end
