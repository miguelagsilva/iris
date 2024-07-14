class OrganizationUser < ApplicationRecord
  belongs_to :organization
  belongs_to :user

  validates :organization_id, uniqueness: { scope: :user_id }
  validates :role, presence: true, inclusion: { in: %w[admin member] }

  enum role: { member: 'member', admin: 'admin' }

  scope :admins, -> { where(role: 'admin') }
  scope :members, -> { where(role: 'member') }
end
