import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { message: "Please enter the correct email" })
    readonly email: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsStrongPassword()
    readonly password: string;


    // @ApiProperty()
    @IsOptional()
    @MinLength(4)
    @MaxLength(4)
    readonly otp: string;

    // @ApiProperty()
    @IsOptional()
    readonly isEmailVerified: boolean;

}