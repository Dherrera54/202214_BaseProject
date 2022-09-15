import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsNotEmpty()
    readonly establishedDate: string;

    @IsUrl()
    @IsNotEmpty()
    readonly image: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}
