import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter the correct email" })
    readonly email: string;

    @ApiProperty()
    @MinLength(4)
    @MaxLength(4)
    @IsString()
    readonly otp: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsStrongPassword()
    readonly newPassword: string;

}