import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto
      )}`
    );
    return await this.tasksService.getAllTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: number, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" retrieving task "${id}".`);
    return this.tasksService.getTasksById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto
      )}`
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: number, @GetUser() user: User) {
    this.logger.verbose(`User "${user.username}" deleting task "${id}".`);
    return this.tasksService.deleteTaskById(id, user);
  }
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: number,
    @Body() updateTaskStatusDto: UpdateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" updating task "${id}". Data: ${JSON.stringify(
        updateTaskStatusDto
      )}`
    );
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user);
  }
}
