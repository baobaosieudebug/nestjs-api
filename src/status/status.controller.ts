import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  async getAll() {
    return await this.statusService.getAll();
  }

  @Get(':id')
  async getStatusById(@Param('id') id: number) {
    return await this.statusService.getOneByIdOrFail(id);
  }

  @Post()
  async createStatus(@Body() dto: AddStatusDTO) {
    return await this.statusService.add(dto);
  }

  @Put(':id')
  async editStatus(@Param('id') id: number, @Body() dto: EditStatusDTO) {
    return await this.statusService.edit(id, dto);
  }

  @Delete(':id')
  async removeStatus(@Param('id') id: number) {
    return await this.statusService.remove(id);
  }
}
