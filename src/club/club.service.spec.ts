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
        email: faker.internet.email(),
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
});
