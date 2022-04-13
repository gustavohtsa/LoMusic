import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

//
const saltOrRounds = 10;

@Injectable()
export class ParseHashPipe implements PipeTransform<any> {
  async transform(value: { password: string }) {
    value.password = await bcrypt.hash(value.password, saltOrRounds);
    return value;
  }
}
