/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AerolineaDto } from '../aerolinea/aerolinea.dto/aerolinea.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoAerolineaController {
    constructor(private readonly aeropuertoAerolineaService: AeropuertoAerolineaService){}

    @Post(':aeropuertoId/airlines/:aerolineaId')
    async addAerolineaAeropuerto(@Param('aeropuertoId') aeropuertoId: string, @Param('aerolineaId') aerolineaId: string){
        return await this.aeropuertoAerolineaService.addAerolineaAeropuerto(aeropuertoId, aerolineaId);
    }

    @Get(':aeropuertoId/airlines/:aerolineaId')
    async findAerolineaByAeropuertoIdAerolineaId(@Param('aeropuertoId') aeropuertoId: string, @Param('aerolineaId') aerolineaId: string){
        return await this.aeropuertoAerolineaService.findAerolineaByAeropuertoIdAerolineaId(aeropuertoId, aerolineaId);
    }

    @Get(':aeropuertoId/airlines')
    async findAerolineasByAeropuertoId(@Param('aeropuertoId') aeropuertoId: string){
        return await this.aeropuertoAerolineaService.findAerolineasByAeropuertoId(aeropuertoId);
    }

    @Put(':aeropuertoId/airlines')
    async associateAerolineasAeropuerto(@Body() aerolineasDto: AerolineaDto[], @Param('aeropuertoId') aeropuertoId: string){
        const aerolineas = plainToInstance(AerolineaEntity, aerolineasDto)
        return await this.aeropuertoAerolineaService.associateAerolineasAeropuerto(aeropuertoId, aerolineas);
    }
    
    @Delete(':aeropuertoId/airlines/:aerolineaId')
    @HttpCode(204)
    async deleteAerolineaAeropuerto(@Param('aeropuertoId') aeropuertoId: string, @Param('aerolineaId') aerolineaId: string){
        return await this.aeropuertoAerolineaService.deleteAerolineaAeropuerto(aeropuertoId, aerolineaId);
    }
}