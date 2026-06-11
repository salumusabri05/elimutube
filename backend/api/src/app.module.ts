import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { CoursesController } from './courses/courses.controller';
import { AssignmentsController } from './assignments/assignments.controller';
import { DiscussionsController } from './discussions/discussions.controller';
import { OrganizationsController } from './organizations/organizations.controller';

@Module({
  imports: [PrismaModule, UsersModule, LessonsModule],
  controllers: [
    AppController,
    CoursesController,
    AssignmentsController,
    DiscussionsController,
    OrganizationsController,
  ],
  providers: [AppService],
})
export class AppModule {}
