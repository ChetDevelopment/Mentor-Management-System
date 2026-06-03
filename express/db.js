const { DataSource } = require('typeorm');
require('dotenv').config();

let dataSource = null;

async function getDb() {
  if (dataSource && dataSource.isInitialized) return dataSource;

  const isProd = process.env.NODE_ENV === 'production';
  const dbUrl = process.env.DATABASE_URL;

  const config = dbUrl
    ? { type: 'postgres', url: dbUrl, ssl: { rejectUnauthorized: false } }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'mentor_management',
      };

  dataSource = new DataSource({
    ...config,
    synchronize: !isProd,
    logging: isProd ? ['error'] : ['error', 'warn'],
    entities: [
      require('../dist/entities/user/user.entity').User,
      require('../dist/entities/mentor/mentor.entity').Mentor,
      require('../dist/entities/mentee/mentee.entity').Mentee,
      require('../dist/entities/skill/skill.entity').Skill,
      require('../dist/entities/category/category.entity').Category,
      require('../dist/entities/session/session.entity').Session,
      require('../dist/entities/message.entity').Message,
      require('../dist/entities/notification.entity').Notification,
      require('../dist/entities/resource/resource.entity').Resource,
      require('../dist/entities/availability/availability.entity').Availability,
      require('../dist/entities/blocked-date.entity').BlockedDate,
      require('../dist/entities/feedback/feedback.entity').Feedback,
      require('../dist/entities/matching/matching.entity').Matching,
    ],
  });

  await dataSource.initialize();
  console.log('DB connected');
  return dataSource;
}

function getRepo(entity) {
  return getDb().then(ds => ds.getRepository(entity));
}

module.exports = { getDb, getRepo };
