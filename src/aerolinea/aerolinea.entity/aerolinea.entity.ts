/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AeropuertoEntity } from '../../aeropuerto/aeropuerto.entity/aeropuerto.entity';

@Entity()
export class AerolineaEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   nombre: string;

   @Column()
   descripcion: string;

   @Column()
   fecha_fundacion: Date;

   @Column()
   pagina_web: string;

   @ManyToMany(() => AeropuertoEntity , aeropuerto => aeropuerto.aerolineas)
   aeropuertos: AeropuertoEntity[];

}