class HomeController < ApplicationController

  def home_page
    success_response(message: 'hi, this is jackrabbit server')
  end

end
