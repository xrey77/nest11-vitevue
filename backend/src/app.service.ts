import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'NEST 11.0.10 RESTful API';
  }
}
