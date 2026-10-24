import { configValidationSchema } from './config.schema';

const validEnv = {
  STAGE: 'app',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USERNAME: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_DATABASE: 'tasks',
  JWT_SECRET: 'secret',
};

describe('configValidationSchema', () => {
  it('accepts a complete env', () => {
    const { error } = configValidationSchema.validate(validEnv);
    expect(error).toBeUndefined();
  });

  it('converts DB_PORT from a string', () => {
    const { error, value } = configValidationSchema.validate({
      ...validEnv,
      DB_PORT: '6543',
    });
    expect(error).toBeUndefined();
    expect(value.DB_PORT).toBe(6543);
  });

  it.each([
    'STAGE',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'JWT_SECRET',
  ])('rejects an env without %s', (key) => {
    const env = { ...validEnv };
    delete env[key];
    const { error } = configValidationSchema.validate(env);
    expect(error?.message).toContain(key);
  });
});
