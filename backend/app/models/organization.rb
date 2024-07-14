class Organization < ApplicationRecord
  has_many :organization_users, dependent: :destroy
  has_many :users, through: :organization_users
  has_many :groups, dependent: :destroy

  validates :name, presence: true, uniqueness: true

  scope :sorted_by_name, -> { order(name: :asc) }
  scope :filter_by_name, ->(name) { where("name ILIKE ?", "%#{name}%") }

  def admins
    users.where(organization_users: { role: 'admin' })
  end

  def members
    users.where(organization_users: { role: 'member' })
  end
end
