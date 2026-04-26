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
import { Plan } from '../plans/plans.model';
import {
  InferAttributes,
  InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import { Product } from '../products/products.model';
import { User } from '../users/users.model';

@Table({
  tableName: 'pending_policies',
  paranoid: true,
  timestamps: true,
})
export class PendingPolicy extends Model<
  InferAttributes<PendingPolicy>,
  InferCreationAttributes<PendingPolicy>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => Plan)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
  })
  declare planId: number;

  @BelongsTo(() => Plan)
  declare plan: CreationOptional<Plan>;

  @Column({
    allowNull: false,
    type: DataType.ENUM('unused', 'used'),
    defaultValue: 'unused',
  })
  declare status: CreationOptional<'unused' | 'used'>;
}

@Table({
  tableName: 'policies',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['beneficiaryId', 'productId'],
      name: 'uniq_beneficiary_product_policy',
    },
    {
      unique: true,
      fields: ['policyNumber'],
    },
  ],
})
export class Policy extends Model<
  InferAttributes<Policy>,
  InferCreationAttributes<Policy>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => Plan)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
  })
  declare planId: number;

  @BelongsTo(() => Plan)
  declare plan: CreationOptional<Plan>;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
  })
  declare productId: number;

  @BelongsTo(() => Product)
  declare product: CreationOptional<Product>;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    onDelete: 'RESTRICT',
  })
  declare beneficiaryId: number;

  @BelongsTo(() => User)
  declare beneficiary: CreationOptional<User>;

  @Column({
    allowNull: false,
    unique: true,
  })
  declare policyNumber: string;
}
