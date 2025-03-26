
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  longDescription: string;

  @Prop()
  image: string;

  @Prop()
  instructor: string;

  @Prop()
  instructorImage: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviews: number;

  @Prop({ default: 0 })
  students: number;

  @Prop()
  duration: string;

  @Prop()
  lessons: number;

  @Prop()
  level: string;

  @Prop()
  category: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ required: true })
  price: string;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isNew: boolean;

  @Prop()
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);