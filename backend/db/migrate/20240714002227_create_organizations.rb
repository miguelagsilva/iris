class CreateOrganizations < ActiveRecord::Migration[6.1]
  def change
    create_table :organizations, id: :uuid do |t|
      t.string :name, null: false
      t.timestamps
    end
    add_index :organizations, :name, unique: true
  end
end
