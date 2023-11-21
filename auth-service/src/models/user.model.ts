import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique, DataType } from 'sequelize-typescript';

@Table
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false // This makes the username field not null
  })
  username!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    unique: true,
    //email needs to be unique
    allowNull: false
  })
  email!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW, // Sets the default value to the current date and time
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW, // Sets the default value to the current date and time
  })
  updatedAt!: Date;

}

export { User };
