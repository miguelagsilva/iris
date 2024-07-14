class CreateGroups < ActiveRecord::Migration[7.1]
  def change
    create_table :groups, id: :uuid do |t|
      t.string :name, null: false
      t.references :organization, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
    add_index :groups, [:name, :organization_id], unique: true
  end
end
