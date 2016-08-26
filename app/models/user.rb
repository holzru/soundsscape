# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  username        :string           not null
#  picture_url     :string
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ActiveRecord::Base
  has_many :tracks
  has_many :track_likes
  has_many :liked_tracks, through: :track_likes, source: :track
  has_many :sessions

  validates :username, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true }
  validates(
    :username,
    :password_digest,
    presence: true
  )

  attr_reader :password

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    user && user.is_password?(password) ? user : nil
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password).to_s
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end
end
