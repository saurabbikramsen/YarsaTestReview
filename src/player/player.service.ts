import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PlayerDto, PlayerUpdateDto } from './Dto/player.dto';
import { CommonUtils } from '../utils/common.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SseService } from '../serverSentEvents/sse.service';
import * as argon from 'argon2';

@Injectable()
export class PlayerService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private utils: CommonUtils,
    private sseService: SseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getLeaderboard() {
    const leaderboardData = await this.cacheManager.get('leaderboard');

    if (leaderboardData) return leaderboardData;

    const players = await this.prisma.player.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        active: true,
        country: true,
        statistics: {
          select: {
            experience_point: true,
            coins: true,
            games_won: true,
            games_played: true,
          },
        },
      },
      orderBy: { statistics: { experience_point: 'desc' } },
      take: 5,
    });

    const rankedPlayers = players.map((player, index) => {
      const rank = index + 1;
      return { ...player, rank };
    });
    await this.cacheManager.set(
      'leaderboard',
      rankedPlayers,
      parseInt(this.config.get('REDIS_STORE_TIME')),
    );

    return rankedPlayers;
  }

  async getPlayer(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id, active: true },
      select: {
        id: true,
        name: true,
        active: true,
        country: true,
        statistics: {
          select: {
            games_won: true,
            coins: true,
            games_played: true,
            experience_point: true,
          },
        },
      },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async getBulkPlayer(id: string) {
    if (id.includes(',')) {
      const players_ids = id.split(',');
      return this.prisma.player.findMany({
        where: { id: { in: players_ids }, active: true },
        select: {
          id: true,
          name: true,
          active: true,
          country: true,
          statistics: {
            select: {
              games_won: true,
              coins: true,
              games_played: true,
              experience_point: true,
            },
          },
        },
      });
    } else {
      return this.getPlayer(id);
    }
  }

  async getAllPlayers(
    search: string,
    take: number,
    skip: number,
    country: string,
  ) {
    const players = await this.prisma.player.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
        country: { contains: country },
      },
      skip,
      take,
      select: {
        id: true,
        name: true,
        active: true,
        country: true,
        statistics: {
          select: {
            coins: true,
            experience_point: true,
            games_played: true,
            games_won: true,
          },
        },
      },
    });
    const count = await this.prisma.player.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
        country: { contains: country },
      },
    });
    return this.utils.paginatedResponse(
      'user/players/all',
      players,
      skip,
      take,
      count,
    );
  }

  async setInactive(id: string) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException('no player found');
    }
    await this.prisma.player.update({
      where: { id },
      data: { active: player.active != true },
    });
    if (player.active == true) {
      return { message: 'player set to Inactive' };
    } else {
      return { message: 'player set to Active' };
    }
  }

  async playGame(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: { statistics: true },
    });
    if (!player || player.active == false)
      throw new BadRequestException('you cannot play the game');

    return this.playNewGame(player);
  }

  async loginSignup(playerDetails: PlayerDto) {
    const player = await this.prisma.player.findUnique({
      where: { email: playerDetails.email },
      select: { email: true, name: true, id: true, role: true, password: true },
    });

    if (player) return this.utils.loginSignup(player, playerDetails.password);

    const errors = [];

    if (!playerDetails.name) errors.push('name should not be empty');

    if (!playerDetails.country) errors.push('country should not be empty');

    if (errors.length) throw new BadRequestException(errors);

    const passwordHash = await argon.hash(playerDetails.password);
    const newPlayer = await this.prisma.player.create({
      data: {
        name: playerDetails.name,
        email: playerDetails.email,
        password: passwordHash,
        country: playerDetails.country,
      },
    });
    await this.prisma.statistics.create({
      data: {
        experience_point: 0,
        games_played: 0,
        games_won: 0,
        coins: 0,
        player_id: newPlayer.id,
      },
    });
    return await this.utils.loginSignup(newPlayer, playerDetails.password);
  }

  async updatePlayer(id: string, playerDetails: PlayerUpdateDto) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException('player not found');
    }
    const playerInfo = { id: player.id, ...playerDetails };
    return this.utils.updatePlayer(playerInfo);
  }

  async deletePlayer(id: string) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException('player not found');
    }
    await this.prisma.player.delete({ where: { id } });
    return {
      message: 'player deleted successfully',
    };
  }

  async playNewGame(player) {
    const game_won = Boolean(Math.round(Math.random()));
    const points = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    const xp = player.statistics.experience_point;
    const highestplayer = await this.prisma.statistics.findFirst({
      orderBy: { experience_point: 'desc' },
    });

    const playerData = await this.prisma.statistics.update({
      where: { id: player.statistics.id },
      data: {
        experience_point: game_won
          ? xp + points
          : xp < 20
          ? xp
          : xp - (points - 9),
        games_played: player.statistics.games_played + 1,
        games_won: game_won
          ? player.statistics.games_won + 1
          : player.statistics.games_won,
        coins: player.statistics.coins + points,
      },
    });
    if (playerData.experience_point > highestplayer.experience_point)
      this.sseService.send(
        `${player.name} is now at the top of the leaderboard with ${playerData.experience_point} XP`,
      );

    return {
      data: {
        games_played: playerData.games_played,
        games_won: playerData.games_won,
        experience_point: playerData.experience_point,
        coins: playerData.coins,
      },
      message: game_won ? 'game won' : 'game lost',
    };
  }
}
