// import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray, IsEnum } from 'class-validator';
// import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {

    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    username: string;
    password: string;
    userpic: string;
    // @IsEmail()
    // @IsNotEmpty()
    // readonly email: string;


    // @IsString()
    // @IsNotEmpty()
    // readonly username: string;

    // @IsString()
    // @MinLength(8)
    // readonly password: string;

    // roles: string;
    // @IsOptional()
    // @IsArray()
    // @IsEnum(Role, { each: true })
    // roles?: Role[];    
}
