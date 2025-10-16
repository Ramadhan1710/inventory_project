import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Barang } from "./Barang";

@Entity()
export class StockLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Barang, (b) => b.stockLogs, { onDelete: "CASCADE" })
  barang!: Barang;

  @Column({ type: "int" })
  delta!: number; // positive for add, negative for reduce

  @Column({ type: "int" })
  stokAfter!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
