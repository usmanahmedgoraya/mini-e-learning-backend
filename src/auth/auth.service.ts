import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { loginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/sign-up.dto';
import { User } from './schema/user.schemas';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) { }

    // ===========
    // Signup User
    // ===========
    async signUp(signUpDto: CreateUserDto): Promise<{ msg: string, user: NonNullable<unknown> }> {
        const { fullName, email, password } = signUpDto
        const existedUser = await this.userModel.findOne({ email })
        if (existedUser) {
            if (!existedUser.isEmailVerified) {
                const otp = await this.SendEmailVerifyAccount(email);
                // Calculate expiration time
                const otpExpiration = new Date(Date.now() + 80000);

                // Update user document with OTP and expiration time
                await this.userModel.findByIdAndUpdate(existedUser._id, {
                    $set: {
                        otp: otp,
                        otpExpiration: otpExpiration
                    }
                });

                throw new UnauthorizedException({
                    msg: 'Email Needs to be verified OTP Send To your email please Check',
                    emailVerified: false
                });
            }
            throw new ConflictException("Email is already existed please try different one");
        }


        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds)
        const otp = await this.SendEmailVerifyAccount(email)
        const user = await this.userModel.create({
            fullName,
            email,
            password: hash,
            otp: otp,
        })
        // const token = this.jwtService.sign({ id: user._id });
        return { msg: `OTP Send to ${email} for verification of Email`, user }
    }

    // ==============
    // Send Email to Verify Account 
    // ==============

    async SendEmailVerifyAccount(email: string) {
        // generate random OTP 4-digit code
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        // Send Mail to user with otp
        await this.sendMail(email, otp);
        return otp;
    }
    async ResendVerifyAccount(email: string): Promise<{ msg: string }> {
        // generate random OTP 4-digit code
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        // Send Mail to user with otp
        const user = await this.findByUsername(email);
        const otpExpiration = new Date(Date.now() + 80000);
        if (!user) {
            throw new NotFoundException('Invalid Email! Wrong Email Please Signup First')
        }

        if (user.isEmailVerified) {
            throw new ConflictException('Email is already verify')
        }
        await this.userModel.findOneAndUpdate(user._id, { otp: otp, otpExpiration: otpExpiration }, { new: true });

        await this.sendMail(email, otp);
        return { msg: "OTP Send Again Please check your email" };
    }


    // ==============
    // Verify Account from OTP 
    // ==============
    async VerifyAccountEmail(email: string, otp: string): Promise<{ token: string }> {

        const user = await this.findByUsername(email)
        if (!user) {
            throw new NotFoundException("Not a valid Email");
        }

        if (user.isEmailVerified) {
            throw new ConflictException("Email is Already Verified");
        }

        if (user.otpExpiration.getTime() < Date.now()) {
            throw new UnauthorizedException("OTP is Expired Now Please request for new OTP")
        }

        if (otp !== user.otp) {
            throw new UnauthorizedException("OTP not Matched")
        }

        const verifiedUser = await this.userModel.findOneAndUpdate(user._id, { otp: "", isEmailVerified: true, otpExpiration: null }, { new: true })

        const token = this.jwtService.sign({ id: verifiedUser._id });
        return { token }
    }



    // ===========
    // Login User 
    // ===========  
    async login(loginDto: loginDto,): Promise<{ token: string, user: NonNullable<unknown> }> {
        const { email, password } = loginDto
        const user = await this.findByUsername(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }

        if (!user.isEmailVerified) {
            const otp = await this.SendEmailVerifyAccount(email);
            // Calculate expiration time
            const otpExpiration = new Date(Date.now() + 80000);

            // Update user document with OTP and expiration time
            await this.userModel.findByIdAndUpdate(user._id, {
                $set: {
                    otp: otp,
                    otpExpiration: otpExpiration
                }
            });
            throw new UnauthorizedException({ message: 'Email verification Required', emailVerified: false })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const newUser = {
            _id: user._id,
            name: user.fullName,
            email: user.email,
        }
        const token = this.jwtService.sign({ id: user._id });
        return { token, user: newUser }
    }

    // =======================
    // Get all Users by Admin
    // =======================

    async getAllUser(): Promise<User[]> {
        return await this.userModel.find()
    }


    // ==============================
    // Send Email for reset password
    // ==============================
    async sendEmailResetPassword(email: string): Promise<{ msg: string }> {
        // Find user with email
        const user = await this.findByUsername(email);
        if (!user) {
            throw new NotFoundException('User Not Found')
        }

        const otpExpiration = new Date(Date.now() + 80000);
        if (!user.isEmailVerified) {
            const otp = await this.SendEmailVerifyAccount(email);
            // Calculate expiration time

            // Update user document with OTP and expiration time
            await this.userModel.findByIdAndUpdate(user._id, {
                $set: {
                    otp: otp,
                    otpExpiration: otpExpiration
                }
            });

            throw new UnauthorizedException({ msg: 'Email Needs to be verified. OTP Send To your email please Check', emailVerified: false })

        }


        // generate random OTP 4-digit code
        const otp = Math.floor(1000 + Math.random() * 9000).toString();


        // Send Mail to user with otp
        await this.sendMailForForgetPassword(email, otp);
        const setResetOtp = await this.userModel.findByIdAndUpdate(user._id, { otp: otp, otpExpiration: otpExpiration }, { new: true })
        return { msg: `Opt Send to ${setResetOtp.email} for verification of Email` }

    }

    // ================
    // verify OTP
    // ================

    async VerifyResetPasswordOtp(otp: string, email: string): Promise<{ userVerified: boolean }> {

        const user = await this.findByUsername(email)
        if (!user) {
            throw new NotFoundException("Not a valid Email")
        }

        if (!user.isEmailVerified) {
            throw new UnauthorizedException({ message: 'Email is not verified', emailVerified: false })

        }

        if (user.otpExpiration.getTime() < Date.now()) {
            throw new UnauthorizedException("OTP is Expired Now Please request for new OTP")
        }

        if (otp !== user.otp) {
            throw new UnauthorizedException("OTP not Matched")
        }
        return { userVerified: true }

    }
    // ================
    // verify OTP
    // ================

    async ResetPassword(otp: string, email: string, newPassword: string): Promise<{ msg: string }> {

        const user = await this.userModel.findOne({ email: email })
        if (!user) {
            throw new NotFoundException("Not a valid Email")
        }

        if (!user.isEmailVerified) {
            throw new ConflictException("Email need to be verified")
        }
        if (otp !== user.otp) {
            throw new UnauthorizedException("OTP not Matched")
        }

        // Creating Hash and salt of Password
        const saltOrRounds = 10;
        const hashPassword = await bcrypt.hash(newPassword, saltOrRounds)

        await this.userModel.findOneAndUpdate(user._id, { otp: "", password: hashPassword }, { new: true })
        return { msg: "The Password Reset Successfully" }

    }

    // =========
    // Send Mail
    // =========

    async sendMail(recieverMail: string, otp: string) {
        // Render the EJS template with the OTP value
        // const html = await ejs.renderFile('./templates/email.ejs', { otp });
        await this.mailerService.sendMail({
            to: recieverMail,
            from: "gorayausman061@gmail.com",
            subject: "Verify Email",
            text: 'Email Verification',
            html: `<div style="font-family: Helvetica,Arial,sans-serif;overflow:auto;line-height:2">
            <div style="margin:50px auto;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Web3Geeks</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Thank you for choosing Web3Geeks. Use the following OTP to complete your Sign Up procedures. OTP is valid for 1 minutes</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
              <p style="font-size:0.9em;">Regards,<br />Web3Geeks</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Web3Geeks Inc</p>
                <p>G.M Plaza Kohinoor City Road</p>
                <p>Faisalabad, Pakistan</p>
              </div>
            </div>
          </div>`
        })
    }


    // Resend Email
    async sendMailForForgetPassword(recieverMail: string, otp: string) {
        this.mailerService.sendMail({
            to: recieverMail,
            from: "gorayausman061@gmail.com",
            subject: "Reset Password",
            text: 'Set New Password',
            html: `<h1>The Reset Password verification OTP is ${otp}</h1>`
        })
    }

    // Google Auth
    async googleLoginCallback(req: any): Promise<string | null> {
        // Extract user data from Google profile
        const { email } = req.user;
        // Check if user exists in the database
        let user: any = await this.findByUsername(email);
        // console.log('check user', user)
        // If user doesn't exist, create a new user with the Google email
        if (!user) {
            console.log('user not find');

            user = await this.createUser(req.user);
        }

        // Generate JWT token
        const payload = { id: user._id };
        return this.jwtService.sign(payload);
    }

    // Github Auth
    async GithubAuth(req) {
        if (!req.user) {
            return 'No user from google'
        }

        return {
            message: 'User information from google',
            user: req.user
        }
    }


    //   Find User by email
    async findByUsername(email: string) {
        return await this.userModel.findOne({ email: email })
    }
    // Create User 
    async createUser(user) {
        // console.log("User Data", user)
        const newUser = await this.userModel.create({
            email: user?.email,
            fullName: user?.fullName,
            password: await this.hashPassword('1234!"£%ASDFasdf'),
            isEmailVerified: true,
            otpExpiration: null,
        })
        // console.log('New User', newUser)
        return newUser;
    }

    // Hashed Password
    async hashPassword(password: string) {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds)
    }

}
