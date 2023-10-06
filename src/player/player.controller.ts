import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
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
import { AdminAuthGuard } from '../user/guard/admin.auth.guard';

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
    summary:
      "Get the data of a specific player or bulk of players by providing multiple Id's seperated by comma",
  })
  @Get('/:id')
  @ApiResponse({ type: PlayerGetDto })
  getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'searchKey', required: false, type: String })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'country', required: false, type: String })
  @Get()
  @ApiResponse({ type: [PlayerGetDto] })
  @ApiOperation({
    summary: 'Get all the players',
  })
  getAllPlayers(
    @Query('searchKey') searchKey = '',
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
    @Query('country') country = '',
  ) {
    const skip = page ? (page - 1) * pageSize : 0;
    return this.playerService.getAllPlayers(searchKey, pageSize, skip, country);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Play game to earn XP and coins',
  })
  @Get('play/:id')
  @ApiResponse({ type: Statistics })
  playGame(@Param('id') id: string) {
    return this.playerService.playGame(id);
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
  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updatePlayer(@Body() playerDto: PlayerUpdateDto, @Param('id') id: string) {
    return this.playerService.updatePlayer(id, playerDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Set the player to inactive state',
  })
  @Patch('setInactive/:id')
  setInactive(@Param('id') id: string) {
    return this.playerService.setInactive(id);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Delete a player',
  })
  @Delete('/:id')
  deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }
}
