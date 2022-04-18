import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
const mockTasksService = () => ({
  getAllTasks: jest.fn(),
  getTasksById: jest.fn(),
  createTask: jest.fn(),
  deleteTaskById: jest.fn(),
  updateTaskStatus: jest.fn(),
});

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useFactory: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
