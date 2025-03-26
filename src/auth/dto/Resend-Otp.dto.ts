import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter the correct email" })
    readonly email: string;

}