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
  delete: jest.fn(),
  save: jest.fn(),
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
    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(service.getTasksById(1, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });
  describe('createTask', function () {
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
    it('calls TasksRepository.createTask and returns a result', async () => {
      tasksRepository.createTask.mockResolvedValue(mockTask);
      const result = await service.createTask(mockCreateTaskDto, mockUser);
      expect(result).toEqual(mockTask);
    });
  });
  describe('deleteTaskById', function () {
    it('deletes the task scoped to the user', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(
        service.deleteTaskById(1, mockUser)
      ).resolves.toBeUndefined();
      expect(tasksRepository.delete).toHaveBeenCalledWith({
        id: 1,
        user: mockUser,
      });
    });
    it('throws NotFoundException when nothing was deleted', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });
  describe('updateTaskStatus', function () {
    it("saves the new status on the user's task", async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: 1,
        status: TaskStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await service.updateTaskStatus(
        1,
        { status: TaskStatus.DONE },
        mockUser
      );
      expect(result.status).toEqual(TaskStatus.DONE);
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        id: 1,
        user: mockUser,
      });
      expect(tasksRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, status: TaskStatus.DONE })
      );
    });
    it('throws NotFoundException and saves nothing for an unknown task', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateTaskStatus(1, { status: TaskStatus.DONE }, mockUser)
      ).rejects.toThrow(NotFoundException);
      expect(tasksRepository.save).not.toHaveBeenCalled();
    });
  });
});
