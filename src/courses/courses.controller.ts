import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Put,
    Delete,
  } from '@nestjs/common';
  import { CoursesService } from './courses.service';
  import { CreateCourseDto } from './dto/create-course.dto';
  import { UpdateCourseDto } from './dto/update-course.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
  
  @ApiTags('courses')
  @Controller('courses')
  export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new course' })
    @ApiResponse({ status: 201, description: 'Course created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createCourseDto: CreateCourseDto) {
      return this.coursesService.create(createCourseDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all courses with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'level', required: false, type: String })
    findAll(@Query() query: any) {
      return this.coursesService.findAll(query);
    }
  
    @Get('featured')
    @ApiOperation({ summary: 'Get featured courses' })
    getFeaturedCourses() {
      return this.coursesService.getFeaturedCourses();
    }
  
    @Get('new')
    @ApiOperation({ summary: 'Get newest courses' })
    getNewCourses() {
      return this.coursesService.getNewCourses();
    }
  
    @Get('categories')
    @ApiOperation({ summary: 'Get all available course categories' })
    getCategories() {
      return this.coursesService.getCategories();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a course by ID' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    findOne(@Param('id') id: string) {
      return this.coursesService.findOne(id);
    }
  
    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get a course by slug' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    findBySlug(@Param('slug') slug: string) {
      return this.coursesService.findBySlug(slug);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a course' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
      return this.coursesService.update(id, updateCourseDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a course' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    remove(@Param('id') id: string) {
      return this.coursesService.remove(id);
    }
  } 