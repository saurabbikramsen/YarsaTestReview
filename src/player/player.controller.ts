import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  PlayerDto,
  PlayerGetDto,
  PlayerLeaderboardDto,
  PlayerUpdateDto,
  Statistics,
} from './Dto/player.dto';
import { UserLoginResponseDto, UserResponseDto } from '../user/Dto/user.dto';
import { PlayerAuthGuard } from './guard/playerAuth.guard';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the leaderboard data of the top 5 players',
  })
  @Get('leaderboard')
  @ApiResponse({ type: [PlayerLeaderboardDto] })
  async getLeaderboard() {
    return this.playerService.getLeaderboard();
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get data of a player',
  })
  @Get()
  @ApiResponse({ type: PlayerGetDto })
  getPlayer(@Req() request: any) {
    return this.playerService.getPlayer(request.id);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "get data of bulk of players by providing multiple Id's seperated by comma",
  })
  @Get('/:ids')
  @ApiResponse({ type: PlayerGetDto })
  getBulkPlayer(@Param('ids') ids: string) {
    return this.playerService.getBulkPlayer(ids);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Play game to earn XP and coins',
  })
  @Get('play/game')
  @ApiResponse({ type: Statistics })
  playGame(@Req() request: any) {
    return this.playerService.playGame(request.id);
  }

  @Post()
  @ApiResponse({ type: UserLoginResponseDto })
  @ApiOperation({
    summary: 'login(needed email & password only) or signup a player',
    description:
      '**country must be one of the following values: np, in, us, au, af**',
  })
  addPlayer(@Body() playerDto: PlayerDto) {
    return this.playerService.loginSignup(playerDto);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the player data with the given id',
    description:
      '**country must be one of the following values: np, in, us, au, af**',
  })
  @Put()
  @ApiResponse({ type: UserResponseDto })
  updatePlayer(@Body() playerDto: PlayerUpdateDto, @Req() request: any) {
    return this.playerService.updatePlayer(request.id, playerDto);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Delete a player',
  })
  @Delete()
  deletePlayer(@Req() request: any) {
    return this.playerService.deletePlayer(request.id);
  }
}
