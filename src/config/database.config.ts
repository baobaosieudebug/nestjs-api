import * as Joi from '@hapi/joi';

export const databaseConfigSchema = {
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.string().default('3307'),
  DATABASE_TYPE: Joi.string().default('mysql'),
  DATABASE_USERNAME: Joi.string().default('root'),
  DATABASE_PASSWORD: Joi.string().default('secret'),
  DATABASE_DB: Joi.string().default('blogdb'),
  DATABASE_LOGGING: Joi.boolean().default(true),
};

export function databaseConfig() {
  return {
    db: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      type: process.env.DATABASE_TYPE,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      logging: process.env.DATABASE_LOGGING + ''.toLowerCase() === 'true',
    },
  };
}
