import {
  InferAttributes,
  InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'product_categories',
  timestamps: false,
})
export class ProductCategory extends Model<
  InferAttributes<ProductCategory>,
  InferCreationAttributes<ProductCategory>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column({
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @HasMany(() => Product)
  declare products: CreationOptional<Product[]>;
}

@Table({
  tableName: 'products',
  timestamps: false,
})
export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column({
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => ProductCategory)
  @Column({ onDelete: 'RESTRICT' })
  declare categoryId: number;

  @BelongsTo(() => ProductCategory)
  declare category: CreationOptional<ProductCategory>;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(12, 2),
  })
  declare price: number;
}
