import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
@Injectable()
export class ParseDataToIntPipe implements PipeTransform {
  transform(value: any): number {
    const transformedValue = parseInt(value, 10);
    if (isNaN(transformedValue)) {
      throw new BadRequestException('can not transform data to number');
    }
    return transformedValue;
  }
}
