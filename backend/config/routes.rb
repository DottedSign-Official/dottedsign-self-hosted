if OnPremiseLicense::PlanReader.enterprise?
  require 'sidekiq/pro/web'
else
  require 'sidekiq/web'
end

Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use Rails.application.config.session_store, Rails.application.config.session_options

Rails.application.routes.draw do
  devise_for :members
  use_doorkeeper

  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    username == Secrets.sidekiq.user_name && password == Secrets.sidekiq.password
  end

  mount Sidekiq::Web => '/sidekiq'
  mount ActionCable.server => '/socket'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :internal do

      namespace :auth do
        get 'member_token', action: 'obtain_member_token'
      end

      resources :signatures, only: [:show]

      resources :sign_tasks, param: :sign_task_id do
        collection do
          post 'create_with_file'
          post 'create_from_template'
          get 'download'
          get 'task_info'
          get 'tasks'
        end
      end

      namespace :files do
        get 'download/:code', action: :download, as: :download
      end

      namespace :mailer do
        scope module: :member_mailer do
          post 'confirmation_instruction'
          post 'first_time_welcome'
          post 'forget_password'
        end

        scope module: :sign_mailer do
          post 'sign_request'
          post 'sign_complete'
          post 'kiosk_complete'
          post 'sign_decline'
          post 'sign_modify'
          post 'sign_confirm'
          post 'sign_pass'
          post 'forget_remind'
          post 'expire_remind'
          post 'signer_verify'
          post 'verify_method_changed'
          post 'forward_request'
          post 'task_update'
          post 'task_disable'
          post 'task_deleted_remind'
          post 'deadline_change'
          post 'doc_backup'
          post 'signer_ca_fail_notify'
          post 'cc_sign_start'
          post 'cc_sign_complete'
          post 'owner_changed_notification'
        end

        scope module: :group_mailer do
          post 'group_invite'
          post 'group_cancel'
        end

        scope module: :system_mailer do
          post 'system_ca_fail_notify'
        end

        scope module: :notification_mailer do
          post 'public_form_compress_download'
        end
      end
    end

    namespace :v1 do
      resources :groups, only: [:index, :show, :create, :update], param: :group_id do
        collection do
          post 'upload_icon'
          post 'add_member'
          delete 'remove_member'
          put 'assign_role'
          post 'accept'
        end
      end

      namespace :groups do
        namespace :sign_tasks do
          resource :decline_reasons, only: [:create, :update, :destroy] do
            get '/', action: 'index'
          end
        end
      end

      namespace :members do
        scope module: :auth do
          post 'register'
          post 'login'
          post 'send_confirm'
          post 'confirm'
          post 'forget_password'
          put 'reset_password'
          put 'change_password'
        end

        scope module: :info do
          get 'me'
          get 'timelines'
          post 'upload_avatar'
          get 'contact_list'
          put 'preference'
          put 'modify'
        end

        namespace :profile do
          get '/', action: :show
          put '/', action: :update
        end
      end

      namespace :sign_tasks do
        scope module: :info do
          get 'read'
          get 'read_from_preview_share_link'
          get 'summary'
          get 'download'
        end

        scope module: :search do
          get 'search'
        end

        scope module: :sign do
          get 'gra_authorize_status'
          post 'consent'
          post 'reissue'
          post 'trigger_verify'
          put 'sign'
        end

        scope module: :audit do
          get 'audit_trail_pdf'
          get 'audit_trail'
        end

        scope module: :notify do
          post 'email_me'
          post 'email_signer'
          post 'remind_now'
        end

        scope module: :change do
          post 'change_signer_requisition'
          put 'change_signer'
          put 'change_task_name'
        end

        namespace :bulk do
          get 'missions'
          post 'create_mission'
          get 'download'
          get 'sample'
        end

        scope module: :decline do
          post 'decline'
        end

        namespace :admin do
          get 'tasks'
          post 'export', defaults: { format: :csv }
          get 'permission'
          put 'change_permission'
          get 'report'
          post 'member_report'
          post 'summary_csv', defaults: { format: :csv }
          post 'member_summary_csv', defaults: { format: :zip }
          post 'reissue'

          resources :roles, only: %i[index create] do
            collection do
              delete '/', action: :destroy
              put 'priorities', action: :change_priorities
            end
          end
        end

        namespace :kiosk do
          post '/', action: 'create'
          post 'verify'
          put 'sign'
        end

        scope module: :review do
          post 'review'
          post 'confirm'
        end
      end

      resources :sign_tasks, param: :sign_task_id do
        collection do
          post 'start'
          post 'sign_and_send'
          get 'filter'
          get 'preview_share_link'
          post 'save_as_template'
          post 'duplicate'

          post 'create_with_file'
          post 'create_from_template'
          post 'create_from_multi_template'
        end

        member do
          post 'change_owner', to: 'sign_tasks/change#change_owner'
        end
      
      end

      resources :envelopes, only: %i[create update destroy], param: :envelope_id do
        collection do
          post 'start'
          get 'preview_share_link'
          post 'duplicate'
        end
        
        member do
          post "change_owner", to: "envelopes/change#change_owner"
        end
      end

      resources :shorten_link, param: :uuid, only: %i[show create]

      resources :templates do
        collection do
          post 'file_share'
          post 'duplicate'
        end
      end

      namespace :templates do
        namespace :share_settings do
          put 'share_template'
          get 'share_list'
          put 'admin_share'
          delete 'admin_remove_share'
        end
      end

      namespace :public_forms do
        namespace :form_tasks do
          get '/', action: 'index'
          post 'start'
          get 'read'
          put 'sign'
        end
      end

      resources :public_forms, param: :form_id, only: [:index, :show, :create, :update, :destroy] do
        collection do
          post 'create_from_template'
          put 'change_status'
          get 'preview'
          get 'export_csv'
          put 'compress'
        end
      end

      namespace :files do
        post 'upload/:code', action: :upload, as: :upload
        get 'download/:code', action: :download, as: :download
        get 'download_attachment', action: :download_attachment, as: :download_attachment
      end

      resources :signatures, only: [:index, :show, :create, :destroy] do
        collection do
          post 'guest_signature'
          post 'images_to_mp4_base64'
        end
      end

      resource :images, only: [:create]

      namespace :task_settings do
        post 'setup'
      end

      namespace :envelope_settings do
        post 'setup'
      end

      resources :tags, only: [:index, :create] do
        collection do
          put 'modify'
          delete 'remove'
          put 'manage'
          put 'move_behind'
        end
      end

      resources :combinations, only: [:show, :create, :update, :destroy] do
        collection do
          get 'list'
          post 'group_share'
          get 'share_info'
        end
      end

      resource :system_cas, only: [:create, :destroy, :update, :show] do
        get 'list'
        put 'access_list'
        get 'system_ca_list_from_email'
      end

      scope module: :general do
        get 'country_list'
        get 'health_check'
        get 'license_info'
      end

      namespace :developer do
        get 'tasks'
        get 'task_detail'
        put 'task_retry_ca'
        post 'reissue'

        namespace :sign_tasks do
          resource :decline_reasons, only: [:create, :update, :destroy] do
            get '/', action: 'index'
          end
        end

        namespace :members do
          get '/', action: 'index'
          put 'modify_status'
        end

        resource :groups, only: [:create, :update] do
          get '/', action: 'index'
          post 'assign_member_to_group'
          delete 'remove_member_from_group'
          put 'change_member_role_in_group'
        end

        namespace :debug_tools do
          get 'sidekiq_retry_list'
        end
      end
    end

    scope module: :home do
      get 'permissions'
    end
  end

  # should be protected by nginx
  namespace :callbacks do
    namespace :gra do
      post 'authorize'
      post 'apply'
    end
  end

  root to: 'home#home_page'
end
