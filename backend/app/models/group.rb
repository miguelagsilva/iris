class Group < ApplicationRecord
  belongs_to :organization
  has_many :group_users, dependent: :destroy
  has_many :users, through: :group_users

  validates :name, presence: true, uniqueness: { scope: :organization_id }

  scope :sorted_by_name, -> { order(name: :asc) }
  scope :filter_by_name, ->(name) { where("name ILIKE ?", "%#{name}%") }

  def admins
    users.where(group_users: { role: 'admin' })
  end

  def members
    users.where(group_users: { role: 'member' })
  end
end
