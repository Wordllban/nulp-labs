import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CSVService } from './csv/csv.service';

async function consoleListener() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const command = process.argv[2];
  switch (command) {
    case 'generate': {
      const csvService = app.get(CSVService);
      csvService.write();
      break;
    }
    case 'push': {
      const csvService = app.get(CSVService);
      await csvService.pushToDB();
      break;
    }
    default: {
      console.log('Command not found');
    }
  }
}

consoleListener();
