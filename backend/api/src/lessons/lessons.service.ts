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
      include: { teacher: true }
    });
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
