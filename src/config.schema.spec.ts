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

  it('defaults DB_PORT to 5432 when it is missing', () => {
    const env = { ...validEnv };
    delete env.DB_PORT;
    const { error, value } = configValidationSchema.validate(env);
    expect(error).toBeUndefined();
    expect(value.DB_PORT).toBe(5432);
  });

  it.each(['abc', '70000'])('rejects DB_PORT=%s', (port) => {
    const { error } = configValidationSchema.validate({
      ...validEnv,
      DB_PORT: port,
    });
    expect(error?.message).toContain('DB_PORT');
  });

  it.each([
    'STAGE',
    'DB_HOST',
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
