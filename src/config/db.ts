import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'androidtv_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
  }
);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully via Sequelize');
    // We will call sync() after defining all relations in server.ts or after seeding
    await sequelize.sync({ alter: true });
    console.log('Database schemas synced successfully');
  } catch (err) {
    console.error('MySQL connection/sync error:', err);
    process.exit(1);
  }
};
