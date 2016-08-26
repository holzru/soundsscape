Rails.application.routes.draw do
  root to: 'static_pages#root'
  namespace :api, defaults: {format: :json} do
    resources :tracks, only: [:index, :create, :update, :destroy]
    resources :reports, only: [:create]
    delete '/reports/clear_track/:track_id', to: 'reports#clear_track'
    get '/tracks/liked', to: 'tracks#liked'
    get '/tracks/posted', to: 'tracks#posted'
    get '/tracks/most_liked', to: 'tracks#most_liked'
    get '/tracks/most_recent', to: 'tracks#most_recent'
    get '/tracks/reported', to: 'tracks#reported'
    post '/tracks/anonymous', to: 'tracks#create_anonymous'
    post '/tracks/build_liked', to: 'tracks#build_liked'
    resources :track_likes, only: [:create, :destroy]
    resources :users, only: [:create, :update]
    resource :session, only: [:create, :destroy]
  end
end
