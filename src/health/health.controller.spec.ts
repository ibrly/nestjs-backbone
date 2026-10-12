import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { HealthController } from './health.controller';

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
});
