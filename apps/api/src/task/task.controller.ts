import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskExistsGuard } from './guards/task-exists.guard';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    const task = this.taskService.create(createTaskDto);
    if (task === null) {
      throw new NotFoundException();
    }
    return task;
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @UseGuards(TaskExistsGuard)
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TaskExistsGuard)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(TaskExistsGuard)
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
