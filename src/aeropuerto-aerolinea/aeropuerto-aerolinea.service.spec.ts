/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aeropuerto: AeropuertoEntity;
  let aerolineasList : AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoAerolineaService],
    }).compile();
 
    service = module.get<AeropuertoAerolineaService>(AeropuertoAerolineaService);
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    aerolineaRepository.clear();
    aeropuertoRepository.clear();

    aerolineasList = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await aerolineaRepository.save({
          nombre: faker.company.name(),
          descripcion: faker.lorem.sentence(),
          fecha_fundacion: faker.date.past(),
          pagina_web: faker.internet.url(),
        })
        aerolineasList.push(aerolinea);
    }

    aeropuerto = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
      aerolineas: aerolineasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAerolineaAeropuerto should add a aerolinea to a aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.url(),
    });

    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    })

    const result: AeropuertoEntity = await service.addAerolineaAeropuerto(newAeropuerto.id, newAerolinea.id);
    
    expect(result.aerolineas.length).toBe(1);
    expect(result.aerolineas[0]).not.toBeNull();
    expect(result.aerolineas[0].nombre).toBe(newAerolinea.nombre);
    expect(result.aerolineas[0].descripcion).toBe(newAerolinea.descripcion);
    expect(result.aerolineas[0].fecha_fundacion).toBe(newAerolinea.fecha_fundacion);
    expect(result.aerolineas[0].pagina_web).toBe(newAerolinea.pagina_web);
  });

  it('addAerolineaAeropuerto should throw exception for an invalid aerolinea', async () => {
    const newAeropuerto: AeropuertoEntity = await aeropuertoRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(3),
      pais: faker.location.country(),
      ciudad: faker.location.city(),
    })

    await expect(() => service.addAerolineaAeropuerto(newAeropuerto.id, "0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found");
  });

  it('addAerolineaAeropuerto should throw an exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.url(),
    });

    await expect(() => service.addAerolineaAeropuerto("0", newAerolinea.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found");
  });

  it('findAerolineaByAeropuertoIdAerolineaId should return aerolinea by aeropuerto', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    const storedAerolinea: AerolineaEntity = await service.findAerolineaByAeropuertoIdAerolineaId(aeropuerto.id, aerolinea.id, )
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toBe(aerolinea.nombre);
    expect(storedAerolinea.descripcion).toBe(aerolinea.descripcion);
    expect(storedAerolinea.fecha_fundacion).toBe(aerolinea.fecha_fundacion);
    expect(storedAerolinea.pagina_web).toBe(aerolinea.pagina_web);
  });

  it('findAerolineaByAeropuertoIdAerolineaId should throw an exception for an invalid aerolinea', async () => {
    await expect(()=> service.findAerolineaByAeropuertoIdAerolineaId(aeropuerto.id, "0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('findAerolineaByAeropuertoIdAerolineaId should throw an exception for an invalid aeropuerto', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0]; 
    await expect(()=> service.findAerolineaByAeropuertoIdAerolineaId("0", aerolinea.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('findAerolineaByAeropuertoIdAerolineaId should throw an exception for an aerolinea not associated to the aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.url(),
    });

    await expect(()=> service.findAerolineaByAeropuertoIdAerolineaId(aeropuerto.id, newAerolinea.id)).rejects.toHaveProperty("message", "The aerolinea with the given id is not associated to the aeropuerto"); 
  });

  it('findAerolineasByAeropuertoId should return aerolineas by aeropuerto', async ()=>{
    const aerolineas: AerolineaEntity[] = await service.findAerolineasByAeropuertoId(aeropuerto.id);
    expect(aerolineas.length).toBe(5)
  });

  it('findAerolineasByAeropuertoId should throw an exception for an invalid aeropuerto', async () => {
    await expect(()=> service.findAerolineasByAeropuertoId("0")).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('associateAerolineasAeropuerto should update aerolineas list for a aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.url(),
    });

    const updatedAeropuerto: AeropuertoEntity = await service.associateAerolineasAeropuerto(aeropuerto.id, [newAerolinea]);
    expect(updatedAeropuerto.aerolineas.length).toBe(1);
    expect(updatedAeropuerto.aerolineas[0].nombre).toBe(newAerolinea.nombre);
    expect(updatedAeropuerto.aerolineas[0].descripcion).toBe(newAerolinea.descripcion);
    expect(updatedAeropuerto.aerolineas[0].fecha_fundacion).toBe(newAerolinea.fecha_fundacion);
    expect(updatedAeropuerto.aerolineas[0].pagina_web).toBe(newAerolinea.pagina_web);
  });

  it('associateAerolineasAeropuerto should throw an exception for an invalid aeropuerto', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.url(),
    });

    await expect(()=> service.associateAerolineasAeropuerto("0", [newAerolinea])).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('associateAerolineasAeropuerto should throw an exception for an invalid aerolinea', async () => {
    const newAerolinea: AerolineaEntity = aerolineasList[0];
    newAerolinea.id = "0";

    await expect(()=> service.associateAerolineasAeropuerto(aeropuerto.id, [newAerolinea])).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('deleteAerolineaToAeropuerto should remove a aerolinea from a aeropuerto', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    
    await service.deleteAerolineaAeropuerto(aeropuerto.id, aerolinea.id);

    const storedAeropuerto: AeropuertoEntity = await aeropuertoRepository.findOne({where: {id: aeropuerto.id}, relations: ["aerolineas"]});
    const deletedAerolinea: AerolineaEntity = storedAeropuerto.aerolineas.find(a => a.id === aerolinea.id);

    expect(deletedAerolinea).toBeUndefined();

  });

  it('deleteAerolineaToAeropuerto should throw an exception for an invalid aerolinea', async () => {
    await expect(()=> service.deleteAerolineaAeropuerto(aeropuerto.id, "0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found"); 
  });

  it('deleteAerolineaToAeropuerto should thrown an exception for an invalid aeropuerto', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await expect(()=> service.deleteAerolineaAeropuerto("0", aerolinea.id)).rejects.toHaveProperty("message", "The aeropuerto with the given id was not found"); 
  });

  it('deleteAerolineaToAeropuerto should thrown an exception for a non asocciated aerolinea', async () => {
    const newAerolinea: AerolineaEntity = await aerolineaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha_fundacion: faker.date.past(),
      pagina_web: faker.internet.url(),
    });

    await expect(()=> service.deleteAerolineaAeropuerto(aeropuerto.id, newAerolinea.id)).rejects.toHaveProperty("message", "The aerolinea with the given id is not associated to the aeropuerto"); 
  }); 

});
