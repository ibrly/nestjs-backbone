import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { HEALTH_QUERY_TIMEOUT_MS, HealthController } from './health.controller';

const mockConnection = () => ({
  query: jest.fn(),
});

describe('HealthController', () => {
  let controller: HealthController;
  let connection: ReturnType<typeof mockConnection>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: getConnectionToken(), useFactory: mockConnection },
      ],
    }).compile();

    controller = module.get(HealthController);
    connection = module.get(getConnectionToken());
  });

  it('reports ok when the database answers', async () => {
    connection.query.mockResolvedValue([{ '?column?': 1 }]);
    await expect(controller.check()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
    expect(connection.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('throws 503 when the database query fails', async () => {
    connection.query.mockRejectedValue(new Error('connection refused'));
    await expect(controller.check()).rejects.toThrow(
      ServiceUnavailableException
    );
  });

  it('logs why the database check failed', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    connection.query.mockRejectedValue(new Error('connection refused'));
    await expect(controller.check()).rejects.toThrow(
      ServiceUnavailableException
    );
    expect(warn).toHaveBeenCalledWith(
      'Database health check failed: connection refused'
    );
    warn.mockRestore();
  });

  it('throws 503 when the database does not answer in time', async () => {
    jest.useFakeTimers();
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    connection.query.mockReturnValue(new Promise(() => undefined));

    const result = controller.check();
    jest.advanceTimersByTime(HEALTH_QUERY_TIMEOUT_MS);

    await expect(result).rejects.toThrow(ServiceUnavailableException);
    expect(warn).toHaveBeenCalledWith(
      `Database health check failed: SELECT 1 timed out after ${HEALTH_QUERY_TIMEOUT_MS}ms`
    );
    warn.mockRestore();
    jest.useRealTimers();
  });
});
