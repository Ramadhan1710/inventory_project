import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Barang } from "./Barang";

@Entity()
export class Price {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Barang, (b) => b.prices, { onDelete: "CASCADE" })
  barang!: Barang;

  @Column({ nullable: false })
  harga!: string; // store as varchar per requirement

  @Column({ type: "date" })
  tanggalBerlaku!: string;
}
