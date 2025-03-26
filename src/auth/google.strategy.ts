import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import axios from 'axios';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/redirect`,
            scope: ['email', 'profile'],
        });
    }
 
    async validate(profile: any): Promise<any> {
        try {
            const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${profile}` },
            });
            console.log(data)
             
            const user = {
                email: data?.email,
                fullName: `${data?.name}`
            };

            return user;
        } catch (error) {
            throw new Error('Failed to retrieve user information from Google.');
        }
    }
}