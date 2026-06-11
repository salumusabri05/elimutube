import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('forum/lesson/:lessonId')
  @ApiOperation({ summary: 'Get or auto-create the discussion forum for a lesson' })
  @ApiParam({ name: 'lessonId', type: String })
  async getOrCreateForum(@Param('lessonId') lessonId: string) {
    const existing = await this.prisma.discussionForum.findUnique({
      where: { lesson_id: lessonId },
      include: {
        topics: {
          include: {
            author: { select: { id: true, display_name: true, avatar_url: true } },
            _count: { select: { replies: true } },
          },
          orderBy: [{ is_pinned: 'desc' }, { created_at: 'desc' }],
        },
      },
    });
    if (existing) return existing;
    const lesson = await this.prisma.lesson.findUniqueOrThrow({ where: { id: lessonId } });
    return this.prisma.discussionForum.create({
      data: { lesson_id: lessonId, title: `Discussion: ${lesson.title}` },
      include: { topics: true },
    });
  }

  @Post('topic')
  @ApiOperation({ summary: 'Post a new discussion topic' })
  @ApiBody({
    schema: {
      type: 'object', required: ['forum_id', 'author_id', 'title', 'body'],
      properties: { forum_id: { type: 'string' }, author_id: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' } },
    },
  })
  async createTopic(@Body() body: any) {
    return this.prisma.discussionTopic.create({
      data: { forum_id: body.forum_id, author_id: body.author_id, title: body.title, body: body.body },
      include: { author: { select: { id: true, display_name: true, avatar_url: true } }, _count: { select: { replies: true } } },
    });
  }

  @Get('topic/:id')
  @ApiOperation({ summary: 'Get a topic with all threaded replies' })
  @ApiParam({ name: 'id', type: String })
  async getTopic(@Param('id') id: string) {
    return this.prisma.discussionTopic.findUniqueOrThrow({
      where: { id },
      include: {
        author: { select: { id: true, display_name: true, avatar_url: true } },
        replies: {
          include: { author: { select: { id: true, display_name: true, avatar_url: true } } },
          orderBy: [{ is_answer: 'desc' }, { upvotes: 'desc' }, { created_at: 'asc' }],
        },
      },
    });
  }

  @Patch('topic/:id')
  @ApiOperation({ summary: 'Update a topic (pin, resolve, edit)' })
  @ApiParam({ name: 'id', type: String })
  async updateTopic(@Param('id') id: string, @Body() body: any) {
    return this.prisma.discussionTopic.update({ where: { id }, data: body });
  }

  @Delete('topic/:id')
  @ApiOperation({ summary: 'Delete a topic and all its replies' })
  @ApiParam({ name: 'id', type: String })
  async deleteTopic(@Param('id') id: string) {
    await this.prisma.discussionTopic.delete({ where: { id } });
    return { success: true };
  }

  @Post('topic/:topicId/reply')
  @ApiOperation({ summary: 'Post a reply to a topic' })
  @ApiParam({ name: 'topicId', type: String })
  @ApiBody({
    schema: {
      type: 'object', required: ['author_id', 'body'],
      properties: { author_id: { type: 'string' }, body: { type: 'string' } },
    },
  })
  async createReply(@Param('topicId') topicId: string, @Body() body: any) {
    return this.prisma.discussionReply.create({
      data: { topic_id: topicId, author_id: body.author_id, body: body.body },
      include: { author: { select: { id: true, display_name: true, avatar_url: true } } },
    });
  }

  @Post('reply/:id/mark-answer')
  @ApiOperation({ summary: 'Mark a reply as the accepted answer (teacher)' })
  @ApiParam({ name: 'id', type: String })
  async markAnswer(@Param('id') id: string) {
    const reply = await this.prisma.discussionReply.findUniqueOrThrow({ where: { id } });
    await this.prisma.discussionReply.updateMany({ where: { topic_id: reply.topic_id }, data: { is_answer: false } });
    await this.prisma.discussionReply.update({ where: { id }, data: { is_answer: true } });
    await this.prisma.discussionTopic.update({ where: { id: reply.topic_id }, data: { is_resolved: true } });
    return { success: true };
  }

  @Post('reply/:id/upvote')
  @ApiOperation({ summary: 'Upvote a reply' })
  @ApiParam({ name: 'id', type: String })
  async upvoteReply(@Param('id') id: string) {
    return this.prisma.discussionReply.update({ where: { id }, data: { upvotes: { increment: 1 } } });
  }

  @Delete('reply/:id')
  @ApiOperation({ summary: 'Delete a reply' })
  @ApiParam({ name: 'id', type: String })
  async deleteReply(@Param('id') id: string) {
    await this.prisma.discussionReply.delete({ where: { id } });
    return { success: true };
  }
}
