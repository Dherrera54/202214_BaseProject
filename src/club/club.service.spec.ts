import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ClubEntity } from './club.entity';


describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
        name: faker.company.name(),
        establishedDate: faker.date.birthdate(),
        image: faker.image.cats(),
        description: faker.lorem.sentence(),
        })
        clubList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name)
    expect(club.image).toEqual(storedClub.image)
    expect(club.establishedDate).toEqual(storedClub.establishedDate)
    expect(club.description).toEqual(storedClub.description)
  
  });
  
  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: "",
      name: faker.company.name(),
      establishedDate: faker.date.birthdate(),
      image: faker.image.cats(),
      description: faker.lorem.sentence(),
      members: []
    }
 
    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();
 
    const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(newClub.name)
    expect(storedClub.establishedDate).toEqual(newClub.establishedDate)
    expect(storedClub.image).toEqual(newClub.image)
    expect(storedClub.description).toEqual(newClub.description)

  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubList[0];
    club.name = "New name";
    club.description = "Description";
     const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
     const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(club.name)
    expect(storedClub.description).toEqual(club.description)
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
     const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });
});
