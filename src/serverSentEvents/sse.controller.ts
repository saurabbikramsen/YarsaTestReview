import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { SseService } from './sse.service';
import { MessageDto, ResponseSse } from './Dto/message.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../user/guard/admin.auth.guard';

@ApiTags('SSE')
@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  @ApiOperation({
    summary: 'Provide response for sse event',
    description:
      '**It responds to the eventsource for the sse event. with api: [url]/sse/event**',
  })
  @ApiResponse({ type: ResponseSse })
  @Get('event')
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

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: MessageDto })
  @ApiOperation({ summary: 'Trigger a SSE event message' })
  @Post('trigger')
  triggerEvent(@Body() data: MessageDto) {
    return this.sseService.send(data.message);
  }
}
