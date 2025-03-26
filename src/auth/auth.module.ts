import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
// import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './github.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from './schema/user.schemas';
// import { CronService } from '../cron/cron.service';

@Module({
  imports: [
    // Use MailerModule
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST,
        port: process.env.PORT,
        service: process.env.SERVICE,
        auth: {
          user: "web3geeks3@gmail.com",
          pass: "xweg ofzr hhan zuvw"
        }
      }
    }),
    // use ConfigModule
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    // ScheduleModule.forRoot(),
    // Use Passport Module
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    // Use Mongoose Module for creating Model
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy],
  exports: [JwtStrategy, PassportModule, GoogleStrategy, GithubStrategy]
})
export class AuthModule { }
