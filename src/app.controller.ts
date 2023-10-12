import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  async defaultGet() {
    return {
      greeting: 'welcome to the playground',
      docs: {
        swagger: [
          'http://localhost:3000/api',
          'https://testapp.yarsa.games/api',
        ],
        'async-api': [
          'http://localhost:3000/async-api',
          'https://testapp.yarsa.games/async-api',
        ],
      },
    };
  }
}
