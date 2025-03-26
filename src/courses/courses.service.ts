import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const slug = slugify(createCourseDto.title, { lower: true });
    const createdCourse = new this.courseModel({
      ...createCourseDto,
      slug,
    });
    return createdCourse.save();
  }

  async findAll(
    query: any = {},
  ): Promise<{ data: Course[]; count: number }> {
    // const { page = 1, limit = 10, search, category, level, ...filters } = query;
    // const skip = (page - 1) * limit;

    // const dbQuery: any = { ...filters };

    // if (search) {
    //   dbQuery.$or = [
    //     { title: { $regex: search, $options: 'i' } },
    //     { description: { $regex: search, $options: 'i' } },
    //     { tags: { $regex: search, $options: 'i' } }
    //   ];
    // }

    // if (category) {
    //   dbQuery.category = category;
    // }

    // if (level) {
    //   dbQuery.level = level;
    // }

    const courses = await this.courseModel
      .find()
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 })
    //   .exec();

    const count = await this.courseModel.countDocuments();

    return { data: courses, count };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findBySlug(slug: string): Promise<Course> {
    const course = await this.courseModel.findOne({ slug }).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const existingCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }
    return existingCourse;
  }

  async remove(id: string): Promise<Course> {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();
    if (!deletedCourse) {
      throw new NotFoundException('Course not found');
    }
    return deletedCourse;
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return this.courseModel.find({ isFeatured: true }).limit(3).exec();
  }

  async getNewCourses(): Promise<Course[]> {
    return this.courseModel
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();
  }

  async getCategories(): Promise<string[]> {
    return this.courseModel.distinct('category').exec();
  }
}