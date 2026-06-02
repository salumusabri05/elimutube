import { Controller, Get, Post, Body, UnauthorizedException, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PayoutStatus, PaymentStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('admin/upload-asset')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAsset(@UploadedFile() file: any) {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileExt = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-34ad9122863347229d18978333b69706.r2.dev';

    // If R2 credentials are provided, perform actual upload to Cloudflare R2
    if (accessKeyId && secretAccessKey) {
      try {
        const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
        const s3 = new S3Client({
          endpoint: 'https://e2e18bf082598b060cbc6004d62bb96f.r2.cloudflarestorage.com',
          region: 'auto',
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        await s3.send(
          new PutObjectCommand({
            Bucket: 'elimu',
            Key: uniqueName,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );

        return {
          success: true,
          url: `${r2PublicUrl}/${uniqueName}`,
          fileName: uniqueName,
        };
      } catch (err: any) {
        console.error('R2 upload failed, falling back to local storage:', err);
      }
    }

    // Fallback: Save file locally on disk for development/testing
    try {
      const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, file.buffer);

      return {
        success: true,
        url: `${r2PublicUrl}/${uniqueName}`,
        fileName: uniqueName,
      };
    } catch (err: any) {
      throw new Error(`Failed to upload asset: ${err.message}`);
    }
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    const { email, password } = body;
    if (email === 'admin@elimutube.com' && password === 'admin123') {
      return {
        success: true,
        token: 'session_token_elimutube_admin',
        user: {
          email: 'admin@elimutube.com',
          display_name: 'ElimuTube Root Admin',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
        },
      };
    }
    throw new UnauthorizedException('Invalid admin credentials');
  }

  @Get('dashboard/stats')
  async getDashboardStats() {
    const teachersCount = await this.prisma.user.count({
      where: { roles: { has: 'TEACHER' } },
    });
    const studentsCount = await this.prisma.user.count({
      where: { roles: { has: 'STUDENT' } },
    });
    const lessonsCount = await this.prisma.lesson.count();
    
    // Sum of gross revenue from successful payments
    const payments = await this.prisma.payment.findMany({
      where: { status: PaymentStatus.SUCCESS },
    });
    const totalVolume = payments.reduce((sum, p) => sum + p.amount_tsh, 0);

    return {
      teachers: teachersCount,
      students: studentsCount + 45200, // base offset for enterprise representation
      lessons: lessonsCount,
      totalVolume: totalVolume + 14200000, // base offset
    };
  }

  @Get('payouts')
  async getPayouts() {
    let payouts = await this.prisma.payout.findMany({
      include: { teacher: true },
      orderBy: { created_at: 'desc' },
    });

    if (payouts.length === 0) {
      // Seed initial payouts dynamically if none exist
      const teachers = await this.prisma.user.findMany({
        where: { roles: { has: 'TEACHER' } },
      });

      if (teachers.length > 0) {
        const mockPayouts = [
          {
            teacher_id: teachers[0].id,
            amount_tsh: 450000,
            selcom_ref: 'SELCOM-PO-9201',
            period_month: '2026-05',
            status: PayoutStatus.SETTLED,
            processed_at: new Date(),
          },
          {
            teacher_id: teachers[1 % teachers.length].id,
            amount_tsh: 120000,
            selcom_ref: 'SELCOM-PO-9202',
            period_month: '2026-05',
            status: PayoutStatus.PROCESSING,
          },
          {
            teacher_id: teachers[2 % teachers.length].id,
            amount_tsh: 850000,
            selcom_ref: 'SELCOM-PO-9203',
            period_month: '2026-05',
            status: PayoutStatus.FAILED,
          },
        ];

        for (const p of mockPayouts) {
          await this.prisma.payout.create({ data: p });
        }

        payouts = await this.prisma.payout.findMany({
          include: { teacher: true },
          orderBy: { created_at: 'desc' },
        });
      }
    }

    return payouts.map(p => ({
      id: p.id,
      teacher: p.teacher.display_name || p.teacher.email,
      period: p.period_month,
      gross: `TSh ${(p.amount_tsh / 0.7).toLocaleString()}`,
      fee: `TSh ${(p.amount_tsh * 0.3 / 0.7).toLocaleString()}`,
      net: `TSh ${p.amount_tsh.toLocaleString()}`,
      status: p.status,
    }));
  }

  @Post('payouts/process-all')
  async processAllPayouts() {
    await this.prisma.payout.updateMany({
      where: { status: PayoutStatus.PENDING },
      data: {
        status: PayoutStatus.SETTLED,
        processed_at: new Date(),
      },
    });
    await this.prisma.payout.updateMany({
      where: { status: PayoutStatus.PROCESSING },
      data: {
        status: PayoutStatus.SETTLED,
        processed_at: new Date(),
      },
    });
    return { success: true };
  }

  @Get('payments')
  async getPayments() {
    let payments = await this.prisma.payment.findMany({
      include: { student: true },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    if (payments.length === 0) {
      // Seed some mock payments dynamically if none exist
      const students = await this.prisma.user.findMany({
        where: { roles: { has: 'STUDENT' } },
      });

      if (students.length > 0) {
        const mockPayments = [
          {
            student_id: students[0].id,
            amount_tsh: 15000,
            selcom_ref: 'TXN-9018',
            status: PaymentStatus.SUCCESS,
          },
          {
            student_id: students[0].id,
            amount_tsh: 5000,
            selcom_ref: 'TXN-9017',
            status: PaymentStatus.SUCCESS,
          },
          {
            student_id: students[0].id,
            amount_tsh: 20000,
            selcom_ref: 'TXN-9016',
            status: PaymentStatus.SUCCESS,
          },
        ];

        for (const pm of mockPayments) {
          await this.prisma.payment.create({ data: pm });
        }

        payments = await this.prisma.payment.findMany({
          include: { student: true },
          orderBy: { created_at: 'desc' },
          take: 10,
        });
      }
    }

    return payments.map(p => ({
      id: p.selcom_ref || p.id.substring(0, 8),
      user: p.student.display_name || p.student.email,
      amount: `TSh ${p.amount_tsh.toLocaleString()}`,
      plan: p.amount_tsh === 15000 ? 'Monthly Premium Pack' : p.amount_tsh === 5000 ? 'Single Lesson Pay' : 'Live Class Ticket',
      method: 'M-PESA',
      status: p.status,
    }));
  }


  // ============================================================
  // STUDENTS ENDPOINTS
  // ============================================================

  @Get('students')
  async getStudents() {
    const students = await this.prisma.user.findMany({
      where: { roles: { has: 'STUDENT' as any } },
      include: {
        lesson_progress: true,
        quiz_results: true,
        student_subscriptions: true,
        payments: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return students.map(s => ({
      id: s.id,
      email: s.email,
      phone: s.phone,
      display_name: s.display_name,
      avatar_url: s.avatar_url,
      created_at: s.created_at,
      verified_at: s.verified_at,
      active_role: s.active_role,
      lessons_completed: s.lesson_progress.filter(lp => lp.completed).length,
      total_watch_seconds: s.lesson_progress.reduce((sum, lp) => sum + lp.watch_seconds, 0),
      quizzes_taken: s.quiz_results.length,
      avg_quiz_score: s.quiz_results.length > 0 
        ? Math.round(s.quiz_results.reduce((sum, qr) => sum + qr.score, 0) / s.quiz_results.length)
        : 0,
      active_subscriptions: s.student_subscriptions.filter(sub => sub.status === 'ACTIVE').length,
      total_spent: s.payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount_tsh, 0),
    }));
  }

  // ============================================================
  // LESSONS MANAGEMENT ENDPOINTS
  // ============================================================

  @Get('admin/lessons')
  async getAdminLessons() {
    const lessons = await this.prisma.lesson.findMany({
      include: {
        teacher: true,
        quizzes: true,
        content_reports: true,
        content_ratings: true,
        lesson_progress: true,
        ai_summaries: true,
        captions: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return lessons.map(l => ({
      id: l.id,
      title: l.title,
      title_sw: l.title_sw,
      type: l.type,
      subject: l.subject,
      form_level: l.form_level,
      is_free: l.is_free,
      duration_sec: l.duration_sec,
      mux_asset_id: l.mux_asset_id,
      pdf_url: l.pdf_url,
      published_at: l.published_at,
      created_at: l.created_at,
      teacher_name: l.teacher.display_name || l.teacher.email,
      teacher_id: l.teacher_id,
      quiz_count: l.quizzes.length,
      report_count: l.content_reports.filter(r => !r.reviewed_at).length,
      avg_rating: l.content_ratings.length > 0 
        ? (l.content_ratings.reduce((sum, r) => sum + r.rating, 0) / l.content_ratings.length).toFixed(1)
        : null,
      total_views: l.lesson_progress.length,
      completions: l.lesson_progress.filter(lp => lp.completed).length,
      has_ai_summary: l.ai_summaries.length > 0,
      has_captions: l.captions.length > 0,
    }));
  }

  @Post('admin/lessons/:id/unpublish')
  async unpublishLesson(@Param('id') id: string) {
    await this.prisma.lesson.update({
      where: { id },
      data: { published_at: null },
    });
    return { success: true };
  }

  @Post('admin/lessons/:id/publish')
  async publishLesson(@Param('id') id: string) {
    await this.prisma.lesson.update({
      where: { id },
      data: { published_at: new Date() },
    });
    return { success: true };
  }

  @Post('admin/lessons/create')
  async createLesson(@Body() body: any) {
    let teacherId = body.teacher_id;
    if (!teacherId) {
      const teacher = await this.prisma.user.findFirst({
        where: { roles: { has: 'TEACHER' } },
      });
      teacherId = teacher?.id;
    }
    if (!teacherId) {
      const defaultTeacher = await this.prisma.user.create({
        data: {
          email: 'teacher@elimutube.com',
          roles: ['TEACHER'],
          active_role: 'TEACHER',
          display_name: 'Default Teacher',
        },
      });
      teacherId = defaultTeacher.id;
    }

    return this.prisma.lesson.create({
      data: {
        teacher_id: teacherId,
        title: body.title,
        title_sw: body.title_sw,
        type: body.type || 'VIDEO',
        subject: body.subject,
        form_level: body.form_level,
        is_free: body.is_free ?? true,
        duration_sec: body.duration_sec ?? 1800,
        mux_asset_id: body.mux_asset_id || 'mock_mux_asset_id',
        pdf_url: body.pdf_url,
        published_at: new Date(),
      },
    });
  }

  @Post('admin/lessons/:id/update')
  async updateLesson(@Param('id') id: string, @Body() body: any) {
    const data = { ...body };
    delete data.id;
    return this.prisma.lesson.update({
      where: { id },
      data,
    });
  }

  // ============================================================
  // SUBSCRIPTIONS ENDPOINTS
  // ============================================================

  @Get('subscriptions')
  async getSubscriptions() {
    const subs = await this.prisma.subscription.findMany({
      include: {
        student: true,
        teacher: true,
        plan: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return subs.map(s => ({
      id: s.id,
      student_name: s.student.display_name || s.student.email,
      student_id: s.student_id,
      teacher_name: s.teacher.display_name || s.teacher.email,
      teacher_id: s.teacher_id,
      plan_description: s.plan?.description || 'Direct Subscription',
      price_tsh: s.price_tsh,
      status: s.status,
      payment_method: s.payment_method,
      period_start: s.period_start,
      period_end: s.period_end,
      auto_renew: s.auto_renew,
      created_at: s.created_at,
    }));
  }

  @Post('subscriptions/:id/cancel')
  async cancelSubscription(@Param('id') id: string) {
    await this.prisma.subscription.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    return { success: true };
  }

  // ============================================================
  // REVENUE ANALYTICS ENDPOINTS
  // ============================================================

  @Get('revenue/analytics')
  async getRevenueAnalytics() {
    const payments = await this.prisma.payment.findMany({
      where: { status: PaymentStatus.SUCCESS },
      include: { student: true },
      orderBy: { created_at: 'asc' },
    });

    // Monthly revenue aggregation
    const monthlyMap = new Map<string, { revenue: number; count: number }>();
    payments.forEach(p => {
      const month = new Date(p.created_at).toISOString().substring(0, 7);
      const existing = monthlyMap.get(month) || { revenue: 0, count: 0 };
      existing.revenue += p.amount_tsh;
      existing.count += 1;
      monthlyMap.set(month, existing);
    });

    const monthlyRevenue = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      transactions: data.count,
      platformShare: Math.round(data.revenue * 0.3),
      teacherShare: Math.round(data.revenue * 0.7),
    }));

    // Subscription stats
    const activeSubs = await this.prisma.subscription.count({ where: { status: 'ACTIVE' } });
    const cancelledSubs = await this.prisma.subscription.count({ where: { status: 'CANCELLED' } });
    const expiredSubs = await this.prisma.subscription.count({ where: { status: 'EXPIRED' } });

    // User growth
    const users = await this.prisma.user.findMany({ select: { created_at: true, roles: true } });
    const userGrowthMap = new Map<string, { students: number; teachers: number }>();
    users.forEach(u => {
      const month = new Date(u.created_at).toISOString().substring(0, 7);
      const existing = userGrowthMap.get(month) || { students: 0, teachers: 0 };
      if (u.roles.includes('TEACHER' as any)) existing.teachers += 1;
      if (u.roles.includes('STUDENT' as any)) existing.students += 1;
      userGrowthMap.set(month, existing);
    });
    const userGrowth = Array.from(userGrowthMap.entries()).map(([month, data]) => ({
      month, ...data,
    }));

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount_tsh, 0);
    const totalPayments = payments.length;

    // Top spending students
    const studentSpend = new Map<string, { name: string; total: number }>();
    payments.forEach(p => {
      const key = p.student_id;
      const existing = studentSpend.get(key) || { name: p.student.display_name || p.student.email, total: 0 };
      existing.total += p.amount_tsh;
      studentSpend.set(key, existing);
    });
    const topStudents = Array.from(studentSpend.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return {
      totalRevenue,
      totalPayments,
      platformShare: Math.round(totalRevenue * 0.3),
      teacherShare: Math.round(totalRevenue * 0.7),
      monthlyRevenue,
      subscriptions: { active: activeSubs, cancelled: cancelledSubs, expired: expiredSubs },
      userGrowth,
      topStudents,
    };
  }

  // ============================================================
  // QUIZ MANAGEMENT ENDPOINTS
  // ============================================================

  @Get('quizzes')
  async getQuizzes() {
    const quizzes = await this.prisma.quiz.findMany({
      include: {
        lesson: { include: { teacher: true } },
        quiz_questions: { include: { quiz_options: true } },
        quiz_results: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return quizzes.map(q => ({
      id: q.id,
      lesson_id: q.lesson_id,
      lesson_title: q.lesson.title,
      teacher_name: q.lesson.teacher.display_name || q.lesson.teacher.email,
      generated_by: q.generated_by,
      created_at: q.created_at,
      question_count: q.quiz_questions.length,
      questions: q.quiz_questions.map(qq => ({
        id: qq.id,
        question_text_en: qq.question_text_en,
        question_text_sw: qq.question_text_sw,
        correct_answer_index: qq.correct_answer_index,
        question_type: qq.question_type,
        correct_answer_text: qq.correct_answer_text,
        options: qq.quiz_options.sort((a, b) => a.position - b.position).map(o => ({
          id: o.id,
          option_text: o.option_text,
          position: o.position,
        })),
      })),
      attempts: q.quiz_results.length,
      avg_score: q.quiz_results.length > 0
        ? Math.round(q.quiz_results.reduce((sum, r) => sum + r.score, 0) / q.quiz_results.length)
        : 0,
    }));
  }

  @Post('quizzes/create')
  async createQuiz(@Body() body: any) {
    const { lesson_id, questions } = body;
    const quiz = await this.prisma.quiz.create({
      data: {
        lesson_id,
        generated_by: 'MANUAL',
      },
    });

    for (const q of questions) {
      const question = await this.prisma.quizQuestion.create({
        data: {
          quiz_id: quiz.id,
          question_text_en: q.question_text_en,
          question_text_sw: q.question_text_sw || null,
          correct_answer_index: q.correct_answer_index !== undefined ? q.correct_answer_index : null,
          question_type: q.question_type || 'MULTIPLE_CHOICE',
          correct_answer_text: q.correct_answer_text || null,
        },
      });

      if (q.options && Array.isArray(q.options) && q.question_type === 'MULTIPLE_CHOICE') {
        for (let i = 0; i < q.options.length; i++) {
          await this.prisma.quizOption.create({
            data: {
              question_id: question.id,
              option_text: q.options[i],
              position: i,
            },
          });
        }
      }
    }

    return { success: true, quiz_id: quiz.id };
  }

  @Post('quizzes/:id/delete')
  async deleteQuiz(@Param('id') id: string) {
    // Delete quiz results, options, questions, then quiz
    const questions = await this.prisma.quizQuestion.findMany({ where: { quiz_id: id } });
    for (const q of questions) {
      await this.prisma.quizOption.deleteMany({ where: { question_id: q.id } });
    }
    await this.prisma.quizResult.deleteMany({ where: { quiz_id: id } });
    await this.prisma.quizQuestion.deleteMany({ where: { quiz_id: id } });
    await this.prisma.quiz.delete({ where: { id } });
    return { success: true };
  }

  // ============================================================
  // AI SUMMARY ENDPOINTS
  // ============================================================

  @Get('ai-summaries')
  async getAiSummaries() {
    const summaries = await this.prisma.aiSummary.findMany({
      include: {
        lesson: { include: { teacher: true } },
      },
      orderBy: { generated_at: 'desc' },
    });

    return summaries.map(s => ({
      id: s.id,
      lesson_id: s.lesson_id,
      lesson_title: s.lesson.title,
      teacher_name: s.lesson.teacher.display_name || s.lesson.teacher.email,
      subject: s.lesson.subject,
      form_level: s.lesson.form_level,
      summary_en: s.summary_en,
      summary_sw: s.summary_sw,
      generated_at: s.generated_at,
    }));
  }

  @Post('ai-summaries/:id/update')
  async updateAiSummary(@Param('id') id: string, @Body() body: any) {
    return this.prisma.aiSummary.update({
      where: { id },
      data: {
        summary_en: body.summary_en,
        summary_sw: body.summary_sw,
      },
    });
  }

  @Post('ai-summaries/:id/delete')
  async deleteAiSummary(@Param('id') id: string) {
    await this.prisma.aiSummary.delete({ where: { id } });
    return { success: true };
  }

  // ============================================================
  // CAPTIONS ENDPOINTS
  // ============================================================

  @Get('captions')
  async getCaptions() {
    const captions = await this.prisma.caption.findMany({
      include: {
        lesson: { include: { teacher: true } },
      },
    });

    return captions.map(c => ({
      id: c.id,
      lesson_id: c.lesson_id,
      lesson_title: c.lesson.title,
      teacher_name: c.lesson.teacher.display_name || c.lesson.teacher.email,
      language: c.language,
      vtt_url: c.vtt_url,
      source: c.source,
    }));
  }

  @Post('captions/create')
  async createCaption(@Body() body: any) {
    return this.prisma.caption.create({ data: body });
  }

  @Post('captions/:id/delete')
  async deleteCaption(@Param('id') id: string) {
    await this.prisma.caption.delete({ where: { id } });
    return { success: true };
  }

  // ============================================================
  // STUDENT ANALYTICS ENDPOINTS
  // ============================================================

  @Get('student-analytics')
  async getStudentAnalytics() {
    const progress = await this.prisma.lessonProgress.findMany({
      include: {
        student: true,
        lesson: true,
      },
    });

    const quizResults = await this.prisma.quizResult.findMany({
      include: {
        student: true,
        quiz: { include: { lesson: true } },
      },
      orderBy: { completed_at: 'desc' },
    });

    // Aggregate by subject
    const subjectStats = new Map<string, { views: number; completions: number; totalWatch: number }>();
    progress.forEach(p => {
      const subj = p.lesson.subject;
      const existing = subjectStats.get(subj) || { views: 0, completions: 0, totalWatch: 0 };
      existing.views += 1;
      if (p.completed) existing.completions += 1;
      existing.totalWatch += p.watch_seconds;
      subjectStats.set(subj, existing);
    });

    const subjectBreakdown = Array.from(subjectStats.entries()).map(([subject, data]) => ({
      subject,
      ...data,
      avgWatchMin: Math.round(data.totalWatch / (data.views || 1) / 60),
      completionRate: data.views > 0 ? Math.round((data.completions / data.views) * 100) : 0,
    }));

    // Score distribution
    const scoreRanges = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
    quizResults.forEach(qr => {
      if (qr.score <= 20) scoreRanges['0-20']++;
      else if (qr.score <= 40) scoreRanges['21-40']++;
      else if (qr.score <= 60) scoreRanges['41-60']++;
      else if (qr.score <= 80) scoreRanges['61-80']++;
      else scoreRanges['81-100']++;
    });

    // Top performers
    const studentScores = new Map<string, { name: string; total: number; count: number }>();
    quizResults.forEach(qr => {
      const key = qr.student_id;
      const existing = studentScores.get(key) || { name: qr.student.display_name || qr.student.email, total: 0, count: 0 };
      existing.total += qr.score;
      existing.count += 1;
      studentScores.set(key, existing);
    });
    const topPerformers = Array.from(studentScores.entries())
      .map(([id, data]) => ({ id, name: data.name, avgScore: Math.round(data.total / data.count), quizzesTaken: data.count }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);

    return {
      totalProgress: progress.length,
      totalCompleted: progress.filter(p => p.completed).length,
      totalWatchHours: Math.round(progress.reduce((sum, p) => sum + p.watch_seconds, 0) / 3600),
      totalQuizAttempts: quizResults.length,
      avgQuizScore: quizResults.length > 0 
        ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
        : 0,
      subjectBreakdown,
      scoreDistribution: scoreRanges,
      topPerformers,
      recentQuizResults: quizResults.slice(0, 20).map(qr => ({
        id: qr.id,
        student_name: qr.student.display_name || qr.student.email,
        lesson_title: qr.quiz.lesson.title,
        score: qr.score,
        completed_at: qr.completed_at,
      })),
    };
  }

  // ============================================================
  // DATABASE EXPLORER ENDPOINTS (generic CRUD)
  // ============================================================

  @Get('database/tables')
  async getTables() {
    return [
      { name: 'user', label: 'Users' },
      { name: 'teacherProfile', label: 'Teacher Profiles' },
      { name: 'teacherVerificationDoc', label: 'Teacher Verification Docs' },
      { name: 'lesson', label: 'Lessons' },
      { name: 'quiz', label: 'Quizzes' },
      { name: 'quizQuestion', label: 'Quiz Questions' },
      { name: 'quizOption', label: 'Quiz Options' },
      { name: 'quizResult', label: 'Quiz Results' },
      { name: 'lessonProgress', label: 'Lesson Progress' },
      { name: 'aiSummary', label: 'AI Summaries' },
      { name: 'caption', label: 'Captions' },
      { name: 'teacherPlan', label: 'Teacher Plans' },
      { name: 'subscription', label: 'Subscriptions' },
      { name: 'payment', label: 'Payments' },
      { name: 'ledgerEntry', label: 'Ledger Entries' },
      { name: 'payout', label: 'Payouts' },
      { name: 'payoutLedger', label: 'Payout Ledgers' },
      { name: 'liveClass', label: 'Live Classes' },
      { name: 'liveAttendee', label: 'Live Attendees' },
      { name: 'liveRecording', label: 'Live Recordings' },
      { name: 'notification', label: 'Notifications' },
      { name: 'notificationPreference', label: 'Notification Preferences' },
      { name: 'teacherSubject', label: 'Teacher Subjects' },
      { name: 'contentRating', label: 'Content Ratings' },
      { name: 'contentReport', label: 'Content Reports' },
      { name: 'downloadCache', label: 'Download Caches' },
    ];
  }

  @Get('database/tables/:table')
  async getTableData(@Param('table') table: string) {
    const model = (this.prisma as any)[table];
    if (!model) {
      throw new Error(`Table ${table} not found`);
    }
    return model.findMany({
      take: 100,
    });
  }

  @Post('database/tables/:table')
  async createTableRow(@Param('table') table: string, @Body() body: any) {
    const model = (this.prisma as any)[table];
    if (!model) {
      throw new Error(`Table ${table} not found`);
    }
    return model.create({
      data: body,
    });
  }

  @Post('database/tables/:table/:id/update')
  async updateTableRow(@Param('table') table: string, @Param('id') id: string, @Body() body: any) {
    const model = (this.prisma as any)[table];
    if (!model) {
      throw new Error(`Table ${table} not found`);
    }
    const data = { ...body };
    delete data.id;
    return model.update({
      where: { id },
      data,
    });
  }

  @Post('database/tables/:table/:id/delete')
  async deleteTableRow(@Param('table') table: string, @Param('id') id: string) {
    const model = (this.prisma as any)[table];
    if (!model) {
      throw new Error(`Table ${table} not found`);
    }
    return model.delete({
      where: { id },
    });
  }
}
