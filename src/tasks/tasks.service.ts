import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {
  }

  async getTasksById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id: id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN
    });
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    const found = await this.taskRepository.delete(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  /*  async updateTaskStatus(id: string, status: { status: TaskStatus }): Promise<Task> {
      return await this.taskRepository.update(id, status);
    }*/

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  /*

   getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
     const {
       status,
       search
     } = filterDto;
     let tasks = this.getAllTasks();

     if (status) {
       tasks = tasks.filter((task) => task.status === status);
     }

     if (search) {
       tasks = tasks.filter(
         (task) =>
           task.title.includes(search) || task.description.includes(search)
       );
     }

     return tasks;
   }




*/
}
