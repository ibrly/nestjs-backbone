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
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }

  // private tasks: Task[] = [];

  /* getAllTasks(): Task[] {
     return this.tasks;
   }

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



   createTask(createTaskDto: CreateTaskDto): Task {
     const task: Task = {
       id: uuid(),
       ...createTaskDto,
       status: TaskStatus.OPEN
     };
     this.tasks.push(task);
     return task;
   }

   deleteTaskById(id: string): void {
     const found = this.getTaskById(id);
     this.tasks = this.tasks.filter((task) => task.id !== found.id);
   }

   updateTaskStatus(id: string, status: { status: TaskStatus }): Task {
     const task = this.getTaskById(id);
     task.status = status.status;
     return task;
   }*/
}
