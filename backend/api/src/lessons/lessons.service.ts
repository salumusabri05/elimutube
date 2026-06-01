import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LessonCreateInput) {
    return this.prisma.lesson.create({ data });
  }

  async findAll() {
    return this.prisma.lesson.findMany({
      include: { 
        teacher: true,
        content_reports: true,
      }
    });
  }

  async findAllReports() {
    return this.prisma.contentReport.findMany({
      include: {
        student: true,
        lesson: {
          include: {
            teacher: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async resolveReport(id: string, action: 'DISMISS' | 'TAKEDOWN') {
    const report = await this.prisma.contentReport.findUnique({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    if (action === 'TAKEDOWN') {
      // Cascade delete the lesson and reports
      await this.prisma.contentReport.deleteMany({
        where: { lesson_id: report.lesson_id },
      });
      await this.prisma.lesson.delete({
        where: { id: report.lesson_id },
      });
    } else {
      // Dismiss the report by updating reviewed_at
      await this.prisma.contentReport.update({
        where: { id },
        data: { reviewed_at: new Date() },
      });
    }

    return { success: true };
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { teacher: true }
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: string, data: Prisma.LessonUpdateInput) {
    return this.prisma.lesson.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }
}
