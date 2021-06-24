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
import { TypeService } from './type.service';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';

@ApiTags('Type')
@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  async getAll() {
    return await this.typeService.getAll();
  }

  @Get(':id')
  async getTypeById(@Param('id') id: number) {
    return await this.typeService.getOneByIdOrFail(id);
  }

  @Post()
  async createType(@Body() dto: AddTypeDTO) {
    return await this.typeService.add(dto);
  }

  @Put(':id')
  async editType(@Param('id') id: number, @Body() dto: EditTypeDTO) {
    return await this.typeService.edit(id, dto);
  }

  @Delete(':id')
  async removeType(@Param('id') id: number) {
    return await this.typeService.remove(id);
  }
}
