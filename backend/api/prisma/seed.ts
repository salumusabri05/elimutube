import 'dotenv/config';
import { PrismaClient, Role, VerificationStatus, SubjectArea, FormLevel, ContentType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records to avoid duplicates in development
  await prisma.user.deleteMany({});
  console.log('🧹 Cleaned existing user database records.');

  // 2. Seed Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@elimutube.com',
      phone: '+255700000001',
      roles: [Role.ADMIN],
      active_role: Role.ADMIN,
      display_name: 'ElimuTube Root Admin',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      verified_at: new Date(),
    },
  });
  console.log(`👤 Seeded Admin: ${admin.email}`);

  // 3. Seed Teachers
  const teacher1 = await prisma.user.create({
    data: {
      email: 'aisha.j@elimutube.ac.tz',
      phone: '+255700000002',
      roles: [Role.TEACHER, Role.STUDENT],
      active_role: Role.TEACHER,
      display_name: 'Mwalimu Aisha Juma',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      verified_at: new Date(),
      teacher_profile: {
        create: {
          bio: 'Specialist in high school Biology and Chemistry. Helping students pass NECTA national exams for 8+ years.',
          intro_video_url: 'https://mux.com/assets/mock-intro-1',
          verification_status: VerificationStatus.APPROVED,
        },
      },
      teacher_subjects: {
        createMany: {
          data: [
            { subject: SubjectArea.BIOLOGY },
            { subject: SubjectArea.CHEMISTRY },
          ],
        },
      },
    },
  });
  console.log(`👤 Seeded Teacher: ${teacher1.email}`);

  const teacher2 = await prisma.user.create({
    data: {
      email: 'salum.sabri@elimutube.ac.tz',
      phone: '+255700000003',
      roles: [Role.TEACHER, Role.STUDENT],
      active_role: Role.TEACHER,
      display_name: 'Mwalimu Salum Sabri',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      verified_at: new Date(),
      teacher_profile: {
        create: {
          bio: 'Mathematics and Physics form IV-VI level lecturer. UDOM alumni.',
          intro_video_url: 'https://mux.com/assets/mock-intro-2',
          verification_status: VerificationStatus.APPROVED,
        },
      },
      teacher_subjects: {
        createMany: {
          data: [
            { subject: SubjectArea.PHYSICS },
            { subject: SubjectArea.MATH },
          ],
        },
      },
    },
  });
  console.log(`👤 Seeded Teacher: ${teacher2.email}`);

  // 4. Seed a Pending Teacher (for Admin Verification Queue testing)
  const pendingTeacher = await prisma.user.create({
    data: {
      email: 'j.mrema@elimutube.ac.tz',
      phone: '+255700000004',
      roles: [Role.TEACHER, Role.STUDENT],
      active_role: Role.TEACHER,
      display_name: 'Josephat Mrema',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      teacher_profile: {
        create: {
          bio: 'Geography and History teacher for Ordinary Level Form I-IV.',
          intro_video_url: 'https://mux.com/assets/mock-intro-3',
          verification_status: VerificationStatus.PENDING,
        },
      },
      teacher_verification_docs: {
        createMany: {
          data: [
            { document_url: 'https://r2.elimutube.com/docs/mrema-degree.pdf', doc_type: 'DEGREE' },
            { document_url: 'https://r2.elimutube.com/docs/mrema-id.jpg', doc_type: 'ID' },
          ],
        },
      },
      teacher_subjects: {
        createMany: {
          data: [
            { subject: SubjectArea.GEOGRAPHY },
            { subject: SubjectArea.HISTORY },
          ],
        },
      },
    },
  });
  console.log(`👤 Seeded Pending Teacher: ${pendingTeacher.email}`);

  // 5. Seed a Student
  const student = await prisma.user.create({
    data: {
      email: 'student@elimutube.com',
      phone: '+255700000005',
      roles: [Role.STUDENT],
      active_role: Role.STUDENT,
      display_name: 'Gabriel Joseph',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      verified_at: new Date(),
    },
  });
  console.log(`👤 Seeded Student: ${student.email}`);

  // 6. Seed a Lesson with mock report for moderation testing
  const biologyLesson = await prisma.lesson.create({
    data: {
      teacher_id: teacher1.id,
      type: ContentType.VIDEO,
      title: 'Physics Form 4: Optics & Reflection',
      title_sw: 'Fizikia Kidato cha 4: Mwanga na Akisi',
      mux_asset_id: 'mux-asset-12903',
      subject: SubjectArea.PHYSICS,
      form_level: FormLevel.FORM_4,
      is_free: false,
      duration_sec: 1240,
      published_at: new Date(),
      content_reports: {
        create: {
          student_id: student.id,
          reason: 'Low audio levels in the second half of the video.',
        },
      },
    },
  });
  console.log(`📚 Seeded Lesson with Report: "${biologyLesson.title}"`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
