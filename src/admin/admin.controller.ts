import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../user/guard/admin.auth.guard';

@Controller('admin')
@UseGuards(AdminAuthGuard)
@ApiTags('Admin Controllers')
export class AdminController {
  constructor(private readonly playerService: PlayerService) {}

  @ApiBearerAuth()
  @Delete('player/:id')
  async deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }
}
