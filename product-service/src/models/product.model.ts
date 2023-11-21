// product.model.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, Unique, DataType } from 'sequelize-typescript';

@Table({
    timestamps: true, // Enables createdAt and updatedAt fields
    tableName: 'products', // Defines the table's name directly
})
export class Product extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column({
        type: DataType.STRING(128),
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.DECIMAL(10, 2), // Supports prices like 99999.99
        allowNull: false,
    })
    price!: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0, // Default version starts at 0
        allowNull: false,
    })
    version!: number;

}
