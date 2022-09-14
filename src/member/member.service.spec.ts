import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MemberEntity } from './member.entity';
import { faker } from '@faker-js/faker';


describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<MemberEntity>;
  let memberList: MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<MemberEntity>>(
      getRepositoryToken(MemberEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    memberList = [];
    for(let i = 0; i < 5; i++){
        const member: MemberEntity = await repository.save({
        name: faker.company.name(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate(),
        })
        memberList.push(member);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all members', async () => {
    const members: MemberEntity[] = await service.findAll();
    expect(members).not.toBeNull();
    expect(members).toHaveLength(memberList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedMemeber: MemberEntity = memberList[0];
    const member: MemberEntity = await service.findOne(storedMemeber.id);
    expect(member).not.toBeNull();
    expect(member.name).toEqual(storedMemeber.name)
    expect(member.email).toEqual(storedMemeber.email)
    expect(member.birthDate).toEqual(storedMemeber.birthDate)
  
  });
  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('create should return a new member', async () => {
    const member: MemberEntity = {
      id: "",
      name: faker.company.name(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate(),
      clubs: []
    }
 
    const newMemeber: MemberEntity = await service.create(member);
    expect(newMemeber).not.toBeNull();
 
    const storedMemeber: MemberEntity = await repository.findOne({where: {id: newMemeber.id}})
    expect(storedMemeber).not.toBeNull();
    expect(storedMemeber.name).toEqual(newMemeber.name)
    expect(storedMemeber.email).toEqual(newMemeber.email)
    expect(storedMemeber.birthDate).toEqual(newMemeber.birthDate)

  });

  it('update should modify a member', async () => {
    const member: MemberEntity = memberList[0];
    member.name = "New name";
    member.email = "New_email@test.com";
     const updatedMemeber: MemberEntity = await service.update(member.id, member);
    expect(updatedMemeber).not.toBeNull();
     const storedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(storedMember).not.toBeNull();
    expect(storedMember.name).toEqual(member.name)
    expect(storedMember.email).toEqual(member.email)
  });

  it('update should throw an exception for an invalid member', async () => {
    let member: MemberEntity = memberList[0];
    member = {
      ...member, name: "New name", email: "New_email@test.com"
    }
    await expect(() => service.update("0", member)).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('delete should remove a member', async () => {
    const member: MemberEntity = memberList[0];
    await service.delete(member.id);
     const deletedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(deletedMember).toBeNull();
  });

  it('delete should throw an exception for an invalid member', async () => {
    const member: MemberEntity = memberList[0];
    await service.delete(member.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });
});
