// order.model.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: 'orders',
})
export class Order extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER.UNSIGNED)
    id!: number;

    // Instead of a direct ForeignKey, we'll just store the IDs
    @Column(DataType.INTEGER.UNSIGNED)
    userId!: number;

    @Column(DataType.INTEGER.UNSIGNED)
    productId!: number;

    @Column(DataType.DECIMAL(10, 2))
    total!: number;

    @Column(DataType.DATE)
    orderDate!: Date;
}
