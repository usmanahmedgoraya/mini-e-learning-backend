import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordOTPDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter the correct email" })
    readonly email: string;

    @ApiProperty()
    @MinLength(4)
    @MaxLength(4)
    @IsString()
    readonly otp: string;

}