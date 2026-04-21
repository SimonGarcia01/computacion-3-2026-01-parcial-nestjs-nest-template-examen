import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectsService } from '@/projects/projects.service';
import { User } from '@/users/entities/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import {TaskAssignment} from '@/task-assignments/entities/task-assignment.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(TaskAssignment) private readonly taskAssignmentRepository: Repository<TaskAssignment>,
        private readonly projectService: ProjectsService,
    ) {}

    async create(createTaskDto: CreateTaskDto): Promise<Task | null> {
        const project = await this.projectService.findOne(createTaskDto.projectId);
        if (!project) throw new NotFoundException();

        let newTask: Task;

        if (createTaskDto.parentTask) {
            const parentTask = await this.findOne(createTaskDto.parentTask);
            if (!parentTask)
                throw new NotFoundException('If this task is going to be a subtask, the parents task must exist');

            newTask = this.taskRepository.create({
                ...CreateTaskDto,
                project: project,
                parentTask: parentTask,
                createdAt: new Date(),
            });
        } else {
            newTask = this.taskRepository.create({
                ...CreateTaskDto,
                project: project,
                createdAt: new Date(),
            });
        }

        return await this.taskRepository.save(newTask);
    }

    async findAll(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    async findOne(id: number): Promise<Task | null> {
        return this.taskRepository.findOneBy({ id: id });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        if(updateTaskDto.status && updateTaskDto.status === TaskStatus.IN_PROGRESS){
            const taskAssignment = this.taskAssignmentRepository.countBy({
                where: {}
            });
        }
        return await ;
    }
}
