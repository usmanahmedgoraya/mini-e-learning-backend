import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class updateUserDto {

    @ApiProperty()
    // @IsString()
    readonly name: string;

    @ApiProperty()
    // @IsString()
    readonly email: string;

    // @ApiProperty()
    // readonly profileImage:string


    @ApiProperty()
    // @IsString()
    // @MinLength(6)
    // @IsStrongPassword()
    @Optional()
    readonly password: string;

    // @IsEnum(UserStatus)
    // readonly userStatus: UserStatus

    // @IsEnum(Role)
    // readonly role:Role
}