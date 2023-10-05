import { Body, Controller, Post, Response } from '@nestjs/common';
import { SseService } from './sse.service';
import { MessageDto } from './Dto/message.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('SSE')
@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  sseEvents(@Response() res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sseObservable = this.sseService.stream();
    sseObservable.subscribe((message) => {
      res.write(`data: ${message}\n\n`);
    });
  }
  @ApiOperation({ summary: 'Trigger a SSE event message' })
  @Post('trigger')
  triggerEvent(@Body() data: MessageDto) {
    console.log(data);
    this.sseService.send(data.message);
  }
}
