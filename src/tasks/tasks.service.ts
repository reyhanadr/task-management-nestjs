import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService, private websocketGateway: WebsocketGateway) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 5;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data: tasks, total, page, limit };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    const { assignedToId, ...taskData } = dto;

    const task = await this.prisma.task.create({
      data: {
        ...taskData,
        createdBy: { connect: { id: userId } },
        ...(assignedToId && {
          assignedTo: { connect: { id: assignedToId } },
        }),
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // EMIT REAL-TIME
    this.websocketGateway.emitTaskCreated(task);

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException("Task not found");
    if (task.createdById !== userId)
      throw new ForbiddenException("Not authorized");

    const updateData: any = { ...dto };

    if (dto.assignedToId !== undefined) {
      updateData.assignedTo = dto.assignedToId
        ? { connect: { id: dto.assignedToId } }
        : { disconnect: true };
      delete updateData.assignedToId;
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // EMIT REAL-TIME
    this.websocketGateway.emitTaskUpdated(updatedTask);

    return updatedTask;
  }

  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException("Task not found");
    if (task.createdById !== userId)
      throw new ForbiddenException("Not authorized");

    const deletedTask = await this.prisma.task.delete({ where: { id } });

    // EMIT REAL-TIME
    this.websocketGateway.emitTaskDeleted(deletedTask.id);

    return { message: "Task deleted" };
  }
}
