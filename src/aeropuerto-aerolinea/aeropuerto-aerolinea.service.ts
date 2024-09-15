/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoAerolineaService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
     
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) {}

    async addAerolineaAeropuerto(aeropuertoId: string, aerolineaId: string): Promise<AeropuertoEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}});
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);
       
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]}) 
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
     
        aeropuerto.aerolineas = [...aeropuerto.aerolineas, aerolinea];
        return await this.aeropuertoRepository.save(aeropuerto);
      }
     
    async findAerolineaByAeropuertoIdAerolineaId(aeropuertoId: string, aerolineaId: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}});
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
        
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]}); 
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
    
        const aeropuertoAerolinea: AerolineaEntity = aeropuerto.aerolineas.find(e => e.id === aerolinea.id);
    
        if (!aeropuertoAerolinea)
          throw new BusinessLogicException("The aerolinea with the given id is not associated to the aeropuerto", BusinessError.PRECONDITION_FAILED)
    
        return aeropuertoAerolinea;
    }
     
    async findAerolineasByAeropuertoId(aeropuertoId: string): Promise<AerolineaEntity[]> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]});
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
        
        return aeropuerto.aerolineas;
    }
     
    async associateAerolineasAeropuerto(aeropuertoId: string, aerolineas: AerolineaEntity[]): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]});
     
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < aerolineas.length; i++) {
          const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineas[i].id}});
          if (!aerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        aeropuerto.aerolineas = aerolineas;
        return await this.aeropuertoRepository.save(aeropuerto);
      }
     
    async deleteAerolineaAeropuerto(aeropuertoId: string, aerolineaId: string){
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: aerolineaId}});
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND)
     
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: aeropuertoId}, relations: ["aerolineas"]});
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND)
     
        const aeropuertoAerolinea: AerolineaEntity = aeropuerto.aerolineas.find(e => e.id === aerolinea.id);
     
        if (!aeropuertoAerolinea)
            throw new BusinessLogicException("The aerolinea with the given id is not associated to the aeropuerto", BusinessError.PRECONDITION_FAILED)

        aeropuerto.aerolineas = aeropuerto.aerolineas.filter(e => e.id !== aerolineaId);
        await this.aeropuertoRepository.save(aeropuerto);
    }   
}
