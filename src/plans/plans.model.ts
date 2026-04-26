import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Product } from '../products/products.model';
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

@Table({
  tableName: 'plans',
  timestamps: true,
})
export class Plan extends Model<
  InferAttributes<Plan>,
  InferCreationAttributes<Plan>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
  })
  declare customerId: number;

  @BelongsTo(() => User, 'customerId')
  declare customer: CreationOptional<User>;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
  })
  declare productId: number;

  @BelongsTo(() => Product)
  declare product: CreationOptional<Product>;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare quantity: number;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(12, 2),
  })
  declare totalPrice: number;
}
