import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { MemberEntity } from '../member/member.entity';

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;  
    @Column()
    establishedDate: Date;
    @Column()
    image: string;
    @Column({length: 100})
    description: string;

    @ManyToMany(() => MemberEntity, (member) => member.clubs)    
    @JoinTable()
    members?: MemberEntity[];
}
