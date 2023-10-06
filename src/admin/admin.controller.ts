import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../user/guard/admin.auth.guard';
import { PlayerUpdateDto } from '../player/Dto/player.dto';

@Controller('admin')
@UseGuards(AdminAuthGuard)
@ApiTags('Admin Controllers')
export class AdminController {
  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin route to delete a player' })
  @ApiBearerAuth()
  @Delete('player/:id')
  async deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }

  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin route to update a player' })
  @ApiBearerAuth()
  @Put('player/:id')
  async updatePlayer(
    @Body() playerData: PlayerUpdateDto,
    @Param('id') id: string,
  ) {
    return this.playerService.updatePlayer(id, playerData);
  }
}
