/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Put, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { AuthService } from './auth.service';
import { EmailVerificationDTO } from './dto/email-verification.dto';
import { loginDto } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/sign-up.dto';
import { User } from './schema/user.schemas';
import { ResetPasswordOTPDTO } from './dto/reset-password-otp.dto';
import { VerifyEmailDto } from './dto/VerifyEmail.dto';
import { ResendOtpDto } from './dto/Resend-Otp.dto';

@ApiTags('Authentication and Authorization')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ) { }

    // ======
    // SignUp
    // ======  
    @Post("/signup")
    @ApiOperation({
        summary: 'Signup User', description: 'Register the user and send OTP to the user on Email'
    })
    @ApiResponse({ status: 200, description: 'Register the user and send OTP to the user on Email' })
    async SignUp(
        @Body()
        signUpDto: CreateUserDto,
    ): Promise<{ msg: string, user: NonNullable<unknown> }> {
        console.log(signUpDto);

        return this.authService.signUp(signUpDto)
    }

    // ======
    // verify User Email
    // ======  
    @Post("/verify-email")
    async VerifyEmail(
        @Body()
        VerifyEmailDto: EmailVerificationDTO,
    ): Promise<{ token: string }> {
        const { email, otp } = VerifyEmailDto
        return this.authService.VerifyAccountEmail(email, otp)
    }

    // ==========
    // Login user
    // ==========

    @Post("/login")
    async login(
        @Body()
        loginDto: loginDto
    ): Promise<{ token: string, user: NonNullable<unknown> }> {
        return this.authService.login(loginDto)
    }


    // =============
    // Get All Users
    // =============

    @Get('users')
    async allUser() {
        return await this.authService.getAllUser();
    }

    // =============================
    // Send Email for reset password
    // =============================
    @Post("password")
    async sendEmailForReset(@Body() body: VerifyEmailDto): Promise<{ msg: string }> {
        const { email } = body
        return await this.authService.sendEmailResetPassword(email)
    }

    // ==============================
    // verify OTP
    // ===============================
    @Post("verify-reset-otp")
    async verifyResetPasswordOTP(@Body() body: ResetPasswordOTPDTO): Promise<{ userVerified: boolean }> {
        const { otp, email } = body
        return await this.authService.VerifyResetPasswordOtp(otp, email)
    }
    // ==============================
    // Reset-Password
    // ===============================
    @Put("reset-password")
    async resetPassword(@Body() ResetPasswordDTO: ResetPasswordDTO): Promise<{ msg: string }> {
        const { otp, email, newPassword } = ResetPasswordDTO
        return await this.authService.ResetPassword(otp, email, newPassword)
    }

    // ==============================
    // Resend Email Verify OTP
    // ===============================
    @Post("resend-otp")
    async resendOTP(@Body() body: ResendOtpDto): Promise<{ msg: string }> {
        const { email } = body
        // const OtpStatus = await this.authService.limitRequestOTP(email)
        // console.log(OtpStatus);

        // if (!OtpStatus) {
        //     throw new ForbiddenException("Too many request please try after 1 hour")
        // }
        return await this.authService.ResendVerifyAccount(email)
    }

    // Google Auth

    @Get('/google')

    @UseGuards(AuthGuard('google'))
    async googleLogin() {
    }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res() res: any) {
        // Handles the Google OAuth 2.0 callback
        // Redirect or respond based on the authentication result
        const token = await this.authService.googleLoginCallback(req);
        return res.redirect(`${process.env.FRONTEND_URL_DEPLOY}/auth/signin?token=${token}`);
    }

    @Get('/github')
    @UseGuards(AuthGuard('github'))
    async githubLogin() { }


    @Get('github/redirect')
    @UseGuards(AuthGuard('github'))
    async githubLoginCallback(@Req() req: any, @Res() res: any) {
        const token = await this.authService.googleLoginCallback(req);
        return res.redirect(`${process.env.FRONTEND_URL_DEPLOY}/auth/signin?token=${token}`);
    }


}
