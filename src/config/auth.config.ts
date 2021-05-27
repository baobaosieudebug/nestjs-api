import * as Joi from '@hapi/joi';

export const authConfigSchema = {
  AUTH_PWD_PEPPER: Joi.string().default('secretPepper'),
  JWT_ACCESS_SECRET_KEY: Joi.string().default('SECRET_KEY'),
  JWT_ACCESS_KEY_LIFE_TIME: Joi.string().default('600s'),
};

export function authConfig() {
  return {
    auth: {
      pwd: {
        pepper: process.env.AUTH_PWD_PEPPER,
      },
      jwt: {
        accessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
        accessKeyLifeTime: process.env.JWT_ACCESS_KEY_LIFE_TIME,
      },
    },
  };
}
