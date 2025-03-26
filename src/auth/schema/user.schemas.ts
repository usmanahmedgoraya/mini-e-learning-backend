import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class User extends Document {
    @Prop()
    fullName: string;

    @Prop({ unique: [true, "Duplicate email enter"]})
    email: string;

    @Prop()
    password: string;

    @Prop({ default: "" })
    otp: string;

    @Prop({ default: false })
    isEmailVerified: boolean;

    @Prop({ type: Date, default: () => new Date(Date.now() + 1 * 80 * 1000) })
    otpExpiration: Date;


}

export const UserSchema = SchemaFactory.createForClass(User);