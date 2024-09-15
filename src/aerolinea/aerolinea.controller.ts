/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { Get, Param, Post, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { AerolineaDto } from './aerolinea.dto/aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { plainToInstance } from 'class-transformer';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
  constructor(
    private readonly aerolineaService: AerolineaService,
  ) {}

  @Get('')
  async findAll() {
    return await this.aerolineaService.findAll();
  }

  @Get(':aerolineaId')
  async findOne(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaService.findOne(aerolineaId);
  }

  @Post('')
  async create(@Body() aerolineaDto: AerolineaDto) {
    const aerolinea: AerolineaEntity = plainToInstance(
      AerolineaEntity,
      aerolineaDto,
    );
    return await this.aerolineaService.create(aerolinea);
  }

  @Put(':aerolineaId')
  async update(
    @Param('aerolineaId') aerolineaId: string,
    @Body() aerolineaDto: AerolineaDto,
  ) {
    const aerolinea: AerolineaEntity = plainToInstance(
      AerolineaEntity,
      aerolineaDto,
    );
    return await this.aerolineaService.update(
      aerolineaId,
      aerolinea,
    );
  }

  @Delete(':aerolineaId')
  @HttpCode(204)
  async delete(@Param('aerolineaId') aerolineaId: string) {
    return await this.aerolineaService.delete(aerolineaId);
  }
}
