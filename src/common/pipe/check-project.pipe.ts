import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ProjectService } from "../../project/project.service";

@Injectable()
export class CheckProjectPipe implements PipeTransform {
  transform(value: number) {
    return value;
  }
}