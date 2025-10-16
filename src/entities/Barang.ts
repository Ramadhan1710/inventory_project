import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Price } from "./Price";
import { StockLog } from "./StockLog";

@Entity()
export class Barang {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  nama!: string;

  @Column({ unique: true })
  kode!: string; // BRG/YY/MM/00001

  @Column({ default: 0 })
  stok!: number;

  @Column({ nullable: true })
  hargaText?: string;

  @Column({ nullable: true })
  fotoPath?: string;

  @OneToMany(() => Price, (p) => p.barang)
  prices?: Price[];

  @OneToMany(() => StockLog, (s) => s.barang)
  stockLogs?: StockLog[];
}
