import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/users/entities/user.entity';
import { Task } from '@/tasks/entities/task.entity';

import { TaskAssignmentsService } from './task-assignments.service';
import { TaskAssignmentsController } from './task-assignments.controller';
import { TaskAssignment } from './entities/task-assignment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssignment, User, Task])],
    controllers: [TaskAssignmentsController],
    providers: [TaskAssignmentsService],
})
export class TaskAssignmentsModule {}
