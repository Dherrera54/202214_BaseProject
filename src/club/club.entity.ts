import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { MemberEntity } from '../member/member.entity';

@Entity()
export class ClubEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;  
    @Column()
    establishdate: Date;
    @Column()
    image: string;
    @Column()
    description: string;

    @ManyToMany(() => MemberEntity, (member) => member.clubs)    
    members: MemberEntity[];
}
