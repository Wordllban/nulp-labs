import { Controller, Post, Get } from '@nestjs/common';
import { CSVService } from './csv.service';

@Controller('csv')
export class CSVController {
  constructor(private readonly csvService: CSVService) {}

  @Post()
  write() {
    return this.csvService.write();
  }

  @Get()
  read() {
    return this.csvService.read();
  }

  @Post('/push')
  pushToDB() {
    return this.csvService.pushToDB();
  }
}
