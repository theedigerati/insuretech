import {
  InferAttributes,
  InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column({
    allowNull: false,
  })
  declare name: string;

  @Column({
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  declare email: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(12, 2),
    defaultValue: 0,
  })
  declare walletBalance: number;
}
