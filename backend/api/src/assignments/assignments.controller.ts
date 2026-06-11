import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus } from '@prisma/client';

@ApiTags('assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────────
  // ASSIGNMENTS
  // ──────────────────────────────────────────────────

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all assignments for a specific lesson' })
  @ApiParam({ name: 'lessonId', type: String })
  async getAssignmentsForLesson(@Param('lessonId') lessonId: string) {
    return this.prisma.assignment.findMany({
      where: { lesson_id: lessonId },
      include: { _count: { select: { submissions: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single assignment with all submissions' })
  @ApiParam({ name: 'id', type: String })
  async getAssignment(@Param('id') id: string) {
    return this.prisma.assignment.findUniqueOrThrow({
      where: { id },
      include: {
        submissions: {
          include: {
            student: { select: { id: true, display_name: true, avatar_url: true } },
            grader: { select: { id: true, display_name: true } },
          },
          orderBy: { submitted_at: 'desc' },
        },
      },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new assignment for a lesson' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['lesson_id', 'title', 'instructions'],
      properties: {
        lesson_id: { type: 'string' },
        title: { type: 'string' },
        instructions: { type: 'string' },
        instructions_sw: { type: 'string' },
        type: { type: 'string', enum: ['TEXT', 'FILE_UPLOAD', 'PEER_REVIEW'], default: 'TEXT' },
        max_score: { type: 'number', default: 100 },
        due_date: { type: 'string', format: 'date-time' },
        allow_late: { type: 'boolean' },
        peer_review_enabled: { type: 'boolean' },
      },
    },
  })
  async createAssignment(@Body() body: any) {
    return this.prisma.assignment.create({
      data: {
        lesson_id: body.lesson_id,
        title: body.title,
        instructions: body.instructions,
        instructions_sw: body.instructions_sw,
        type: body.type ?? 'TEXT',
        max_score: body.max_score ?? 100,
        due_date: body.due_date ? new Date(body.due_date) : null,
        allow_late: body.allow_late ?? false,
        peer_review_enabled: body.peer_review_enabled ?? false,
      },
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiParam({ name: 'id', type: String })
  async updateAssignment(@Param('id') id: string, @Body() body: any) {
    const data = { ...body };
    delete data.id;
    delete data.lesson_id;
    if (data.due_date) data.due_date = new Date(data.due_date);
    return this.prisma.assignment.update({ where: { id }, data });
  }

  // ──────────────────────────────────────────────────
  // SUBMISSIONS
  // ──────────────────────────────────────────────────

  @Get(':assignmentId/submissions')
  @ApiOperation({ summary: 'Get all submissions for an assignment' })
  @ApiParam({ name: 'assignmentId', type: String })
  @ApiQuery({ name: 'status', required: false, enum: SubmissionStatus })
  async getSubmissions(
    @Param('assignmentId') assignmentId: string,
    @Query('status') status?: SubmissionStatus,
  ) {
    return this.prisma.assignmentSubmission.findMany({
      where: {
        assignment_id: assignmentId,
        ...(status && { status }),
      },
      include: {
        student: { select: { id: true, display_name: true, avatar_url: true } },
        grader: { select: { id: true, display_name: true } },
        peer_reviews: true,
      },
      orderBy: { submitted_at: 'desc' },
    });
  }

  @Get('submission/:id')
  @ApiOperation({ summary: 'Get a single submission by ID' })
  @ApiParam({ name: 'id', type: String })
  async getSubmission(@Param('id') id: string) {
    return this.prisma.assignmentSubmission.findUniqueOrThrow({
      where: { id },
      include: {
        student: { select: { id: true, display_name: true, avatar_url: true } },
        grader: { select: { id: true, display_name: true } },
        peer_reviews: { include: { reviewer_submission: { include: { student: { select: { id: true, display_name: true } } } } } },
        assignment: true,
      },
    });
  }

  @Post(':assignmentId/submit')
  @ApiOperation({ summary: 'Submit an assignment (student action)' })
  @ApiParam({ name: 'assignmentId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['student_id'],
      properties: {
        student_id: { type: 'string' },
        content_text: { type: 'string' },
        file_url: { type: 'string' },
      },
    },
  })
  async submitAssignment(@Param('assignmentId') assignmentId: string, @Body() body: any) {
    const assignment = await this.prisma.assignment.findUniqueOrThrow({ where: { id: assignmentId } });
    const isLate = assignment.due_date && new Date() > assignment.due_date;

    return this.prisma.assignmentSubmission.upsert({
      where: { assignment_id_student_id: { assignment_id: assignmentId, student_id: body.student_id } },
      create: {
        assignment_id: assignmentId,
        student_id: body.student_id,
        content_text: body.content_text,
        file_url: body.file_url,
        status: (isLate && !assignment.allow_late) ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED,
      },
      update: {
        content_text: body.content_text,
        file_url: body.file_url,
        submitted_at: new Date(),
      },
    });
  }

  @Post('submission/:id/grade')
  @ApiOperation({ summary: 'Grade a submission (teacher action)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['graded_by', 'score'],
      properties: {
        graded_by: { type: 'string', description: 'Teacher user ID' },
        score: { type: 'number' },
        feedback: { type: 'string' },
      },
    },
  })
  async gradeSubmission(@Param('id') id: string, @Body() body: any) {
    return this.prisma.assignmentSubmission.update({
      where: { id },
      data: {
        graded_by: body.graded_by,
        score: body.score,
        feedback: body.feedback,
        status: SubmissionStatus.GRADED,
        graded_at: new Date(),
      },
    });
  }

  // ──────────────────────────────────────────────────
  // PEER REVIEWS
  // ──────────────────────────────────────────────────

  @Post('submission/:id/peer-review')
  @ApiOperation({ summary: 'Submit a peer review for another student\'s submission' })
  @ApiParam({ name: 'id', type: String, description: 'Submission being reviewed' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['reviewer_submission_id', 'feedback'],
      properties: {
        reviewer_submission_id: { type: 'string', description: 'The reviewer\'s own submission ID' },
        feedback: { type: 'string' },
        score: { type: 'number' },
      },
    },
  })
  async submitPeerReview(@Param('id') id: string, @Body() body: any) {
    return this.prisma.peerReview.create({
      data: {
        submission_id: id,
        reviewer_submission_id: body.reviewer_submission_id,
        feedback: body.feedback,
        score: body.score,
      },
    });
  }
}
