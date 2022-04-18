import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
});
const mockUser = {
  id: 12,
  username: 'Test user',
  password: 'Test password',
  tasks: [],
};
describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getTasks', function () {
    it('calls TasksRepository.getTasks and returns a result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await service.getAllTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });
  describe('getTaskById', function () {
    it('calls TasksRepository.findOne and returns a result', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: 1,
        status: TaskStatus.OPEN,
        userId: mockUser.id,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await service.getTasksById(1, mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', function () {
      tasksRepository.findOne.mockRejectedValue(null);
      expect(service.getTasksById(1, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });
  describe('createTask', function () {
    it('calls TasksRepository.createTask and returns a result', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: 1,
        status: TaskStatus.OPEN,
        userId: mockUser.id,
      };
      const mockCreateTaskDto: CreateTaskDto = {
        title: 'Test task',
        description: 'Test desc',
      };
      tasksRepository.createTask.mockResolvedValue(mockTask);
      const result = await service.createTask(mockCreateTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', function () {
      tasksRepository.findOne.mockRejectedValue(null);
      expect(service.getTasksById(1, mockUser)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
