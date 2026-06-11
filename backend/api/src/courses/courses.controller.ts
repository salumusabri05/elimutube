import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { CourseStatus, SubjectArea, FormLevel } from '@prisma/client';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────────
  // COURSES
  // ──────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all published courses, optionally filtered by subject or form level' })
  @ApiQuery({ name: 'subject', required: false, enum: SubjectArea })
  @ApiQuery({ name: 'form_level', required: false, enum: FormLevel })
  @ApiQuery({ name: 'teacher_id', required: false, type: String })
  async getCourses(
    @Query('subject') subject?: SubjectArea,
    @Query('form_level') form_level?: FormLevel,
    @Query('teacher_id') teacher_id?: string,
  ) {
    return this.prisma.course.findMany({
      where: {
        status: CourseStatus.PUBLISHED,
        ...(subject && { subject }),
        ...(form_level && { form_level }),
        ...(teacher_id && { teacher_id }),
      },
      include: {
        teacher: { select: { id: true, display_name: true, avatar_url: true } },
        modules: {
          orderBy: { order_index: 'asc' },
          include: { lessons: { select: { id: true, title: true, duration_sec: true, is_free: true, type: true } } },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course by ID with full module and lesson breakdown' })
  @ApiParam({ name: 'id', type: String })
  async getCourse(@Param('id') id: string) {
    return this.prisma.course.findUniqueOrThrow({
      where: { id },
      include: {
        teacher: { select: { id: true, display_name: true, avatar_url: true, teacher_profile: true } },
        modules: {
          orderBy: { order_index: 'asc' },
          include: {
            lessons: {
              orderBy: { created_at: 'asc' },
              select: { id: true, title: true, title_sw: true, duration_sec: true, is_free: true, type: true, published_at: true },
            },
          },
        },
      },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course (teacher action)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['teacher_id', 'title', 'subject', 'form_level'],
      properties: {
        teacher_id: { type: 'string' },
        title: { type: 'string' },
        title_sw: { type: 'string' },
        description: { type: 'string' },
        description_sw: { type: 'string' },
        subject: { type: 'string', enum: Object.values(SubjectArea) },
        form_level: { type: 'string', enum: Object.values(FormLevel) },
        thumbnail_url: { type: 'string' },
        is_free: { type: 'boolean' },
        price_tsh: { type: 'number' },
      },
    },
  })
  async createCourse(@Body() body: any) {
    return this.prisma.course.create({
      data: {
        teacher_id: body.teacher_id,
        title: body.title,
        title_sw: body.title_sw,
        description: body.description,
        description_sw: body.description_sw,
        subject: body.subject,
        form_level: body.form_level,
        thumbnail_url: body.thumbnail_url,
        is_free: body.is_free ?? false,
        price_tsh: body.price_tsh ?? 0,
      },
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course details or status' })
  @ApiParam({ name: 'id', type: String })
  async updateCourse(@Param('id') id: string, @Body() body: any) {
    const data = { ...body };
    delete data.id;
    delete data.teacher_id;
    return this.prisma.course.update({ where: { id }, data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course and all its modules' })
  @ApiParam({ name: 'id', type: String })
  async deleteCourse(@Param('id') id: string) {
    await this.prisma.course.delete({ where: { id } });
    return { success: true };
  }

  // ──────────────────────────────────────────────────
  // MODULES
  // ──────────────────────────────────────────────────

  @Get(':courseId/modules')
  @ApiOperation({ summary: 'List all modules in a course' })
  @ApiParam({ name: 'courseId', type: String })
  async getModules(@Param('courseId') courseId: string) {
    return this.prisma.module.findMany({
      where: { course_id: courseId },
      orderBy: { order_index: 'asc' },
      include: { lessons: { orderBy: { created_at: 'asc' } } },
    });
  }

  @Post(':courseId/modules')
  @ApiOperation({ summary: 'Add a new module to a course' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string' },
        title_sw: { type: 'string' },
        description: { type: 'string' },
        order_index: { type: 'number' },
      },
    },
  })
  async createModule(@Param('courseId') courseId: string, @Body() body: any) {
    return this.prisma.module.create({
      data: {
        course_id: courseId,
        title: body.title,
        title_sw: body.title_sw,
        description: body.description,
        order_index: body.order_index ?? 0,
      },
    });
  }

  @Patch('modules/:moduleId')
  @ApiOperation({ summary: 'Update a module' })
  @ApiParam({ name: 'moduleId', type: String })
  async updateModule(@Param('moduleId') moduleId: string, @Body() body: any) {
    const data = { ...body };
    delete data.id;
    delete data.course_id;
    return this.prisma.module.update({ where: { id: moduleId }, data });
  }

  @Delete('modules/:moduleId')
  @ApiOperation({ summary: 'Delete a module (cascades to lessons)' })
  @ApiParam({ name: 'moduleId', type: String })
  async deleteModule(@Param('moduleId') moduleId: string) {
    await this.prisma.module.delete({ where: { id: moduleId } });
    return { success: true };
  }
}
