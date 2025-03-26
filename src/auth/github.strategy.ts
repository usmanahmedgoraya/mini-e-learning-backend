import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Profile, Strategy } from 'passport-github2';
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/github/redirect`,
      scope: ['public_profile', 'read:user', "user:email"],
    });
  }
  async validate(profile: Profile): Promise<any> {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${profile}`,
      },
    });
    const emails = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${profile}`,
      },
    });
    console.log("Response Data", response);
    console.log("Email data", emails?.data[0]?.email);
    const user = {
      email: emails?.data[0]?.email,
      fullName: response.data.name
    };
    return user;
  }
} 