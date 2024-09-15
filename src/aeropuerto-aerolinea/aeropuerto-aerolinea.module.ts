/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoAerolineaController } from './aeropuerto-aerolinea.controller';

@Module({
  providers: [AeropuertoAerolineaService],
  imports: [TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity])],
  controllers: [AeropuertoAerolineaController],
})
export class AeropuertoAerolineaModule {}
