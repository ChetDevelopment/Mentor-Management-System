import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { databaseConfig } from '../src/config';
import {
  DayOfWeek,
  MentorStatus,
  SessionStatus,
  UserRole,
} from '../src/constants';
import { AvailabilityStatus } from '../src/entities/mentor/mentor.entity';
import { ActivityLog } from '../src/entities/activity-log/activity-log.entity';
import { AuthToken } from '../src/entities/auth/auth-token.entity';
import { Availability } from '../src/entities/availability/availability.entity';
import { BlockedDate } from '../src/entities/blocked-date.entity';
import { Category } from '../src/entities/category/category.entity';
import { Feedback } from '../src/entities/feedback/feedback.entity';
import { Matching } from '../src/entities/matching/matching.entity';
import { Mentee } from '../src/entities/mentee/mentee.entity';
import { Mentor } from '../src/entities/mentor/mentor.entity';
import { Message } from '../src/entities/message.entity';
import { Notification } from '../src/entities/notification.entity';
import { Resource } from '../src/entities/resource/resource.entity';
import { Session } from '../src/entities/session/session.entity';
import { Skill } from '../src/entities/skill/skill.entity';
import { User } from '../src/entities/user/user.entity';

const dbUrl = process.env.DATABASE_URL;

const dataSource = dbUrl
  ? new DataSource({
      type: 'postgres',
      url: dbUrl,
      synchronize: false,
      ssl: { rejectUnauthorized: false },
      entities: [
        ActivityLog,
        AuthToken,
        Availability,
        BlockedDate,
        Category,
        Feedback,
        Matching,
        Mentee,
        Mentor,
        Message,
        Notification,
        Resource,
        Session,
        Skill,
        User,
      ],
    })
  : new DataSource({
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      synchronize: false,
      entities: [
        ActivityLog,
        AuthToken,
        Availability,
        BlockedDate,
        Category,
        Feedback,
        Matching,
        Mentee,
        Mentor,
        Message,
        Notification,
        Resource,
        Session,
        Skill,
        User,
      ],
    });

type UserSeed = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
};

type MentorSeed = {
  email: string;
  nid: string;
  title: string;
  company: string;
  yearsOfExperience: number;
  status: MentorStatus;
  skills: string[];
};

type MenteeSeed = {
  email: string;
  occupation: string;
  organization: string;
  goals: string;
  interests: string[];
};

const password = 'Password123!';

const users: UserSeed[] = [
  {
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@mentorkhet.test',
    role: UserRole.ADMIN,
    phone: '010000001',
  },
  {
    firstName: 'Sophea',
    lastName: 'Chan',
    email: 'sophea.mentor@mentorkhet.test',
    role: UserRole.MENTOR,
    phone: '010000101',
  },
  {
    firstName: 'Dara',
    lastName: 'Kim',
    email: 'dara.mentor@mentorkhet.test',
    role: UserRole.MENTOR,
    phone: '010000102',
  },
  {
    firstName: 'Sreynich',
    lastName: 'Long',
    email: 'sreynich.mentor@mentorkhet.test',
    role: UserRole.MENTOR,
    phone: '010000103',
  },
  {
    firstName: 'Vuthy',
    lastName: 'Mean',
    email: 'vuthy.pending@mentorkhet.test',
    role: UserRole.MENTOR,
    phone: '010000104',
  },
  {
    firstName: 'Nita',
    lastName: 'Chroun',
    email: 'nita.mentee@mentorkhet.test',
    role: UserRole.MENTEE,
    phone: '010000201',
  },
  {
    firstName: 'Rina',
    lastName: 'Sok',
    email: 'rina.mentee@mentorkhet.test',
    role: UserRole.MENTEE,
    phone: '010000202',
  },
  {
    firstName: 'Pisey',
    lastName: 'Heng',
    email: 'pisey.mentee@mentorkhet.test',
    role: UserRole.MENTEE,
    phone: '010000203',
  },
];

const categories = [
  {
    name: 'Software Development',
    description: 'Programming, architecture, and engineering practices.',
  },
  {
    name: 'Data and AI',
    description: 'Analytics, machine learning, and applied AI skills.',
  },
  {
    name: 'Product and Design',
    description: 'Product thinking, UX, research, and design execution.',
  },
  {
    name: 'Career Growth',
    description: 'Leadership, communication, interviews, and planning.',
  },
];

const skills = [
  ['JavaScript', 'Software Development'],
  ['TypeScript', 'Software Development'],
  ['NestJS', 'Software Development'],
  ['Database Design', 'Software Development'],
  ['Data Analysis', 'Data and AI'],
  ['Machine Learning', 'Data and AI'],
  ['Product Management', 'Product and Design'],
  ['UX Research', 'Product and Design'],
  ['Career Planning', 'Career Growth'],
  ['Technical Interviewing', 'Career Growth'],
];

const mentorProfiles: MentorSeed[] = [
  {
    email: 'sophea.mentor@mentorkhet.test',
    nid: 'MMS-MENTOR-001',
    title: 'Senior Backend Engineer',
    company: 'Phnom Penh Tech Lab',
    yearsOfExperience: 8,
    status: MentorStatus.APPROVED,
    skills: ['TypeScript', 'NestJS', 'Database Design'],
  },
  {
    email: 'dara.mentor@mentorkhet.test',
    nid: 'MMS-MENTOR-002',
    title: 'Data Scientist',
    company: 'Mekong Analytics',
    yearsOfExperience: 6,
    status: MentorStatus.APPROVED,
    skills: ['Data Analysis', 'Machine Learning', 'Technical Interviewing'],
  },
  {
    email: 'sreynich.mentor@mentorkhet.test',
    nid: 'MMS-MENTOR-003',
    title: 'Product Design Lead',
    company: 'Design Forward Cambodia',
    yearsOfExperience: 7,
    status: MentorStatus.APPROVED,
    skills: ['Product Management', 'UX Research', 'Career Planning'],
  },
  {
    email: 'vuthy.pending@mentorkhet.test',
    nid: 'MMS-MENTOR-004',
    title: 'Frontend Developer',
    company: 'Applicant Demo Studio',
    yearsOfExperience: 3,
    status: MentorStatus.PENDING,
    skills: ['JavaScript', 'TypeScript'],
  },
];

const menteeProfiles: MenteeSeed[] = [
  {
    email: 'nita.mentee@mentorkhet.test',
    occupation: 'Computer Science Student',
    organization: 'Royal University of Phnom Penh',
    goals: 'Build confidence with backend development and prepare for internships.',
    interests: ['TypeScript', 'NestJS', 'Technical Interviewing'],
  },
  {
    email: 'rina.mentee@mentorkhet.test',
    occupation: 'Junior Analyst',
    organization: 'Cambodia Data Hub',
    goals: 'Improve data analysis workflow and learn machine learning basics.',
    interests: ['Data Analysis', 'Machine Learning', 'Career Planning'],
  },
  {
    email: 'pisey.mentee@mentorkhet.test',
    occupation: 'Product Intern',
    organization: 'Startup Cambodia',
    goals: 'Learn product discovery and better UX research habits.',
    interests: ['Product Management', 'UX Research', 'Career Planning'],
  },
];

async function upsertBy<T extends { id?: string }>(
  repository: Repository<T>,
  where: Partial<T>,
  data: Partial<T>,
): Promise<T> {
  const existing = await repository.findOne({ where: where as any });
  if (existing) {
    repository.merge(existing, data as any);
    return repository.save(existing as any) as Promise<T>;
  }

  const entity = repository.create(data as any) as unknown as T;
  return repository.save(entity as any) as unknown as Promise<T>;
}

async function addColumnIfMissing(
  tableName: string,
  columnName: string,
  definition: string,
) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const hasColumn = await queryRunner.hasColumn(tableName, columnName);
    if (!hasColumn) {
      await queryRunner.query(
        `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definition}`,
      );
    }
  } finally {
    await queryRunner.release();
  }
}

async function createTableIfMissing(tableName: string, createSql: string) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const hasTable = await queryRunner.hasTable(tableName);
    if (!hasTable) {
      await queryRunner.query(createSql);
    }
  } finally {
    await queryRunner.release();
  }
}

async function ensureSeedSchema() {
  await addColumnIfMissing('users', 'resetToken', 'VARCHAR(255)');
  await addColumnIfMissing('users', 'resetTokenExpiry', 'TIMESTAMP');

  await addColumnIfMissing('skills', 'categoryId', 'VARCHAR(36)');

  await addColumnIfMissing('mentors', 'nid', 'VARCHAR(255)');
  await addColumnIfMissing('mentors', 'phone', 'VARCHAR(255)');
  await addColumnIfMissing('mentors', 'avatar', 'VARCHAR(255)');
  await addColumnIfMissing('mentors', 'cvUrl', 'VARCHAR(255)');
  await addColumnIfMissing('mentors', 'portfolioUrl', 'VARCHAR(255)');
  await addColumnIfMissing('mentors', 'status', "VARCHAR(20) NOT NULL DEFAULT 'pending'");
  await addColumnIfMissing('mentors', 'rejectionReason', 'VARCHAR(255)');
  await addColumnIfMissing('mentors', 'approvedAt', 'TIMESTAMP');
}

async function seedUsers(userRepository: Repository<User>) {
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const user of users) {
    await upsertBy(
      userRepository,
      { email: user.email },
      {
        ...user,
        password: hashedPassword,
        isActive: true,
      },
    );
  }
}

async function seedCategoriesAndSkills(
  categoryRepository: Repository<Category>,
  skillRepository: Repository<Skill>,
) {
  const categoryByName = new Map<string, Category>();
  const skillByName = new Map<string, Skill>();

  for (const category of categories) {
    const savedCategory = await upsertBy(
      categoryRepository,
      { name: category.name },
      { ...category, isActive: true },
    );
    categoryByName.set(savedCategory.name, savedCategory);
  }

  for (const [name, categoryName] of skills) {
    const category = categoryByName.get(categoryName);
    const savedSkill = await upsertBy(
      skillRepository,
      { name },
      {
        name,
        description: `${name} mentorship and guided practice.`,
        categoryId: category?.id,
        category,
        isActive: true,
      },
    );
    skillByName.set(savedSkill.name, savedSkill);
  }

  return skillByName;
}

async function seedMentors(
  userRepository: Repository<User>,
  mentorRepository: Repository<Mentor>,
  skillByName: Map<string, Skill>,
) {
  const mentorByEmail = new Map<string, Mentor>();
  const mentorSkillPairs: Array<{ mentorId: string; skillId: string }> = [];

  for (const profile of mentorProfiles) {
    const user = await userRepository.findOneByOrFail({ email: profile.email });
    const profileSkills = profile.skills
      .map(skill => skillByName.get(skill))
      .filter(Boolean) as Skill[];

    const existing = await mentorRepository.findOne({
      where: { userId: user.id },
    });

    const mentor = existing ?? mentorRepository.create({ userId: user.id });
    mentor.user = user;
    mentor.userId = user.id;
    mentor.nid = profile.nid;
    mentor.phone = user.phone;
    mentor.avatar = user.avatar;
    mentor.cvUrl = `/uploads/cv/${profile.nid.toLowerCase()}.pdf`;
    mentor.portfolioUrl = `https://portfolio.example.com/${user.firstName.toLowerCase()}`;
    mentor.status = profile.status;
    mentor.approvedAt =
      profile.status === MentorStatus.APPROVED
        ? (mentor.approvedAt ?? new Date())
        : null;
    mentor.title = profile.title;
    mentor.company = profile.company;
    mentor.yearsOfExperience = profile.yearsOfExperience;
    mentor.availabilityStatus = AvailabilityStatus.AVAILABLE;

    const savedMentor = await mentorRepository.save(mentor);
    profileSkills.forEach(skill => {
      mentorSkillPairs.push({ mentorId: savedMentor.id, skillId: skill.id });
    });
    mentorByEmail.set(profile.email, savedMentor);
  }

  await seedMentorSkills(mentorSkillPairs);

  return mentorByEmail;
}

async function seedMentorSkills(
  mentorSkillPairs: Array<{ mentorId: string; skillId: string }>,
) {
  for (const pair of mentorSkillPairs) {
    await dataSource.query(
      'INSERT INTO "mentor_skills" ("mentorsId", "skillsId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [pair.mentorId, pair.skillId],
    );
  }
}

async function seedMentees(
  userRepository: Repository<User>,
  menteeRepository: Repository<Mentee>,
) {
  const menteeByEmail = new Map<string, Mentee>();

  for (const profile of menteeProfiles) {
    const user = await userRepository.findOneByOrFail({ email: profile.email });
    const mentee = await upsertBy(
      menteeRepository,
      { userId: user.id },
      {
        user,
        userId: user.id,
        organization: profile.organization,
        careerGoal: profile.goals,
        interests: profile.interests,
        isActive: true,
      },
    );
    menteeByEmail.set(profile.email, mentee);
  }

  return menteeByEmail;
}

async function seedAvailability(
  availabilityRepository: Repository<Availability>,
  mentors: Mentor[],
) {
  const schedule = [
    { dayOfWeek: DayOfWeek.MON, startTime: '09:00', endTime: '11:00' },
    { dayOfWeek: DayOfWeek.WED, startTime: '14:00', endTime: '16:00' },
    { dayOfWeek: DayOfWeek.FRI, startTime: '10:00', endTime: '12:00' },
  ];

  for (const mentor of mentors) {
    for (const slot of schedule) {
      await upsertBy(
        availabilityRepository,
        {
          mentorId: mentor.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
        },
        {
          mentorId: mentor.id,
          ...slot,
          isActive: true,
        },
      );
    }
  }
}

async function seedSessions(
  sessionRepository: Repository<Session>,
  mentors: Map<string, Mentor>,
  mentees: Map<string, Mentee>,
) {
  const now = Date.now();
  const sessionSeeds = [
    {
      title: 'Backend Architecture Review',
      mentor: 'sophea.mentor@mentorkhet.test',
      mentee: 'nita.mentee@mentorkhet.test',
      status: SessionStatus.COMPLETED,
      scheduledAt: new Date(now - 12 * 24 * 60 * 60 * 1000),
      notes: 'Covered module structure and service boundaries.',
    },
    {
      title: 'NestJS API Practice',
      mentor: 'sophea.mentor@mentorkhet.test',
      mentee: 'nita.mentee@mentorkhet.test',
      status: SessionStatus.CONFIRMED,
      scheduledAt: new Date(now + 3 * 24 * 60 * 60 * 1000),
      notes: null,
    },
    {
      title: 'Data Portfolio Planning',
      mentor: 'dara.mentor@mentorkhet.test',
      mentee: 'rina.mentee@mentorkhet.test',
      status: SessionStatus.COMPLETED,
      scheduledAt: new Date(now - 8 * 24 * 60 * 60 * 1000),
      notes: 'Outlined dashboard project and dataset ideas.',
    },
    {
      title: 'Machine Learning Roadmap',
      mentor: 'dara.mentor@mentorkhet.test',
      mentee: 'rina.mentee@mentorkhet.test',
      status: SessionStatus.NO_SHOW,
      scheduledAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
      notes: 'Mentee did not attend.',
    },
    {
      title: 'UX Research Interview Prep',
      mentor: 'sreynich.mentor@mentorkhet.test',
      mentee: 'pisey.mentee@mentorkhet.test',
      status: SessionStatus.COMPLETED,
      scheduledAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
      notes: 'Practiced interview scripts and note synthesis.',
    },
    {
      title: 'Product Discovery Coaching',
      mentor: 'sreynich.mentor@mentorkhet.test',
      mentee: 'pisey.mentee@mentorkhet.test',
      status: SessionStatus.CANCELLED,
      scheduledAt: new Date(now + 2 * 24 * 60 * 60 * 1000),
      notes: 'Cancelled by mentee.',
    },
  ];

  const sessions = new Map<string, Session>();

  for (const sessionSeed of sessionSeeds) {
    const mentor = mentors.get(sessionSeed.mentor);
    const mentee = mentees.get(sessionSeed.mentee);

    if (!mentor || !mentee) {
      continue;
    }

    const session = await upsertBy(
      sessionRepository,
      { title: sessionSeed.title },
      {
        mentorId: mentor.id,
        menteeId: mentee.id,
        title: sessionSeed.title,
        description: `Demo seed session: ${sessionSeed.title}.`,
        scheduledAt: sessionSeed.scheduledAt,
        duration: 60,
        status: sessionSeed.status,
        meetingLink: `https://meet.example.com/${sessionSeed.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}`,
        notes: sessionSeed.notes,
      },
    );
    sessions.set(sessionSeed.title, session);
  }

  return sessions;
}

async function seedFeedback(
  feedbackRepository: Repository<Feedback>,
  sessions: Map<string, Session>,
) {
  const feedbackSeeds = [
    {
      session: 'Backend Architecture Review',
      rating: 5,
      comment: 'Very clear guidance and practical examples.',
    },
    {
      session: 'Data Portfolio Planning',
      rating: 4,
      comment: 'Helpful direction for choosing a realistic portfolio project.',
    },
    {
      session: 'UX Research Interview Prep',
      rating: 5,
      comment: 'Great practice session with actionable feedback.',
    },
  ];

  for (const feedbackSeed of feedbackSeeds) {
    const session = sessions.get(feedbackSeed.session);

    if (!session) {
      continue;
    }

    await upsertBy(
      feedbackRepository,
      { sessionId: session.id },
      {
        mentorId: session.mentorId,
        menteeId: session.menteeId,
        sessionId: session.id,
        rating: feedbackSeed.rating,
        comment: feedbackSeed.comment,
        isAnonymous: false,
      },
    );
  }
}

async function updateMentorStats(
  mentorRepository: Repository<Mentor>,
  sessionRepository: Repository<Session>,
  feedbackRepository: Repository<Feedback>,
  mentors: Mentor[],
) {
  for (const mentor of mentors) {
    const [sessions, feedbacks] = await Promise.all([
      sessionRepository.find({ where: { mentorId: mentor.id } }),
      feedbackRepository.find({ where: { mentorId: mentor.id } }),
    ]);
    const rating =
      feedbacks.length > 0
        ? Math.round(
            (feedbacks.reduce((total, feedback) => total + feedback.rating, 0) /
              feedbacks.length) *
              100,
          ) / 100
        : 0;

    await mentorRepository.update(mentor.id, {
      rating,
      totalSessions: sessions.length,
    });
  }
}

async function verifyDatabase() {
  const userRepository = dataSource.getRepository(User);
  const mentorRepository = dataSource.getRepository(Mentor);
  const menteeRepository = dataSource.getRepository(Mentee);
  const categoryRepository = dataSource.getRepository(Category);
  const skillRepository = dataSource.getRepository(Skill);
  const availabilityRepository = dataSource.getRepository(Availability);
  const sessionRepository = dataSource.getRepository(Session);
  const feedbackRepository = dataSource.getRepository(Feedback);

  const [
    totalUsers,
    totalAdmins,
    totalMentors,
    approvedMentors,
    pendingMentors,
    totalMentees,
    totalCategories,
    totalSkills,
    totalAvailability,
    totalSessions,
    totalFeedback,
  ] = await Promise.all([
    userRepository.count(),
    userRepository.count({ where: { role: UserRole.ADMIN } }),
    mentorRepository.count(),
    mentorRepository.count({ where: { status: MentorStatus.APPROVED } }),
    mentorRepository.count({ where: { status: MentorStatus.PENDING } }),
    menteeRepository.count(),
    categoryRepository.count(),
    skillRepository.count(),
    availabilityRepository.count(),
    sessionRepository.count(),
    feedbackRepository.count(),
  ]);

  return {
    totalUsers,
    totalAdmins,
    totalMentors,
    approvedMentors,
    pendingMentors,
    totalMentees,
    totalCategories,
    totalSkills,
    totalAvailability,
    totalSessions,
    totalFeedback,
  };
}

async function main() {
  await dataSource.initialize();
  await ensureSeedSchema();

  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const skillRepository = dataSource.getRepository(Skill);
  const mentorRepository = dataSource.getRepository(Mentor);
  const menteeRepository = dataSource.getRepository(Mentee);
  const availabilityRepository = dataSource.getRepository(Availability);
  const sessionRepository = dataSource.getRepository(Session);
  const feedbackRepository = dataSource.getRepository(Feedback);

  await seedUsers(userRepository);
  const skillByName = await seedCategoriesAndSkills(
    categoryRepository,
    skillRepository,
  );
  const mentors = await seedMentors(userRepository, mentorRepository, skillByName);
  const mentees = await seedMentees(userRepository, menteeRepository);
  await seedAvailability(availabilityRepository, Array.from(mentors.values()));
  const sessions = await seedSessions(sessionRepository, mentors, mentees);
  await seedFeedback(feedbackRepository, sessions);
  await updateMentorStats(
    mentorRepository,
    sessionRepository,
    feedbackRepository,
    Array.from(mentors.values()),
  );

  const verification = await verifyDatabase();
  console.log('Database seeded successfully.');
  console.table(verification);
  console.log(`Demo password for all seeded users: ${password}`);
}

main()
  .catch(error => {
    console.error('Seed failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
