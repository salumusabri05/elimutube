import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationRole } from '@prisma/client';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────────────
  // ORGANIZATIONS
  // ──────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  async listOrganizations() {
    return this.prisma.organization.findMany({
      include: { _count: { select: { members: true, groups: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization with all members and groups' })
  @ApiParam({ name: 'id', type: String })
  async getOrganization(@Param('id') id: string) {
    return this.prisma.organization.findUniqueOrThrow({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, display_name: true, email: true, avatar_url: true } } },
          orderBy: { joined_at: 'desc' },
        },
        groups: { include: { _count: { select: { members: true } } } },
      },
    });
  }

  @Post()
  @ApiOperation({ summary: 'Register a new school or institution' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'contact_email'],
      properties: {
        name: { type: 'string', example: 'Mwalimu High School' },
        country: { type: 'string', default: 'TZ' },
        city: { type: 'string' },
        contact_email: { type: 'string' },
        contact_phone: { type: 'string' },
        logo_url: { type: 'string' },
      },
    },
  })
  async createOrganization(@Body() body: any) {
    return this.prisma.organization.create({ data: body });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization details' })
  @ApiParam({ name: 'id', type: String })
  async updateOrganization(@Param('id') id: string, @Body() body: any) {
    const data = { ...body };
    delete data.id;
    return this.prisma.organization.update({ where: { id }, data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiParam({ name: 'id', type: String })
  async deleteOrganization(@Param('id') id: string) {
    await this.prisma.organization.delete({ where: { id } });
    return { success: true };
  }

  // ──────────────────────────────────────────────────
  // MEMBERS
  // ──────────────────────────────────────────────────

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a user to an organization' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['user_id'],
      properties: {
        user_id: { type: 'string' },
        role: { type: 'string', enum: Object.values(OrganizationRole), default: 'STUDENT' },
      },
    },
  })
  async addMember(@Param('id') id: string, @Body() body: any) {
    return this.prisma.organizationMember.create({
      data: { organization_id: id, user_id: body.user_id, role: body.role ?? OrganizationRole.STUDENT },
      include: { user: { select: { id: true, display_name: true, email: true } } },
    });
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a user from an organization' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'userId', type: String })
  async removeMember(@Param('id') organizationId: string, @Param('userId') userId: string) {
    await this.prisma.organizationMember.deleteMany({
      where: { organization_id: organizationId, user_id: userId },
    });
    return { success: true };
  }

  // ──────────────────────────────────────────────────
  // STUDENT GROUPS
  // ──────────────────────────────────────────────────

  @Get(':id/groups')
  @ApiOperation({ summary: 'List all student groups in an organization' })
  @ApiParam({ name: 'id', type: String })
  async listGroups(@Param('id') id: string) {
    return this.prisma.studentGroup.findMany({
      where: { organization_id: id },
      include: { _count: { select: { members: true } } },
    });
  }

  @Post(':id/groups')
  @ApiOperation({ summary: 'Create a new student group inside an organization' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string', example: 'Form IV A' }, description: { type: 'string' } },
    },
  })
  async createGroup(@Param('id') id: string, @Body() body: any) {
    return this.prisma.studentGroup.create({
      data: { organization_id: id, name: body.name, description: body.description },
    });
  }

  @Get('groups/:groupId')
  @ApiOperation({ summary: 'Get a student group with all members' })
  @ApiParam({ name: 'groupId', type: String })
  async getGroup(@Param('groupId') groupId: string) {
    return this.prisma.studentGroup.findUniqueOrThrow({
      where: { id: groupId },
      include: {
        members: { include: { group: false } },
        organization: { select: { id: true, name: true } },
      },
    });
  }

  @Post('groups/:groupId/members')
  @ApiOperation({ summary: 'Add a student to a group' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiBody({
    schema: { type: 'object', required: ['user_id'], properties: { user_id: { type: 'string' } } },
  })
  async addGroupMember(@Param('groupId') groupId: string, @Body() body: any) {
    return this.prisma.studentGroupMember.create({ data: { group_id: groupId, user_id: body.user_id } });
  }

  @Delete('groups/:groupId/members/:userId')
  @ApiOperation({ summary: 'Remove a student from a group' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiParam({ name: 'userId', type: String })
  async removeGroupMember(@Param('groupId') groupId: string, @Param('userId') userId: string) {
    await this.prisma.studentGroupMember.deleteMany({ where: { group_id: groupId, user_id: userId } });
    return { success: true };
  }
}
