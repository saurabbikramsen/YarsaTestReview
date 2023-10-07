import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { CommonUtils } from './common.utils';
import { RefreshDto, RefreshResponseDto } from '../user/Dto/user.dto';
import { UserService } from '../user/user.service';

@ApiTags('common')
@Controller('common')
export class UtilsController {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private commonUtils: CommonUtils,
  ) {}

  @Post('generaterefresh')
  @ApiResponse({ type: RefreshResponseDto })
  @ApiOperation({
    summary: 'generate a new access and refresh token',
  })
  expireRefreshToken(@Body() refreshDto: RefreshDto) {
    console.log(refreshDto);
    return this.userService.generateNewTokens(refreshDto);
  }
}
