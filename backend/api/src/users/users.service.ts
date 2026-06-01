import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role, VerificationStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findTeachers() {
    return this.prisma.user.findMany({
      where: {
        roles: {
          has: Role.TEACHER,
        },
      },
      include: {
        teacher_profile: true,
        teacher_verification_docs: true,
      },
    });
  }

  async verifyTeacher(id: string, status: VerificationStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { teacher_profile: true },
    });

    if (!user) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Update the verification status on the teacher profile
    if (user.teacher_profile) {
      await this.prisma.teacherProfile.update({
        where: { id: user.teacher_profile.id },
        data: { verification_status: status },
      });
    } else {
      await this.prisma.teacherProfile.create({
        data: {
          teacher_id: id,
          verification_status: status,
        },
      });
    }

    // Update user verified_at if approved
    return this.prisma.user.update({
      where: { id },
      data: {
        verified_at: status === VerificationStatus.APPROVED ? new Date() : null,
      },
      include: {
        teacher_profile: true,
        teacher_verification_docs: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        teacher_profile: true,
        teacher_verification_docs: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
