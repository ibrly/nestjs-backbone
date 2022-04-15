import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.tasksService.getAllTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.tasksService.getTasksById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string) {
    return this.tasksService.deleteTaskById(id);
  }
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: number,
    @Body() updateTaskStatusDto: UpdateTaskDto
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto);
  }
}
