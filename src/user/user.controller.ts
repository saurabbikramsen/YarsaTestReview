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
import { UserService } from './user.service';
import {
  PaginatedResponseDto,
  RefreshDto,
  RefreshResponseDto,
  SeedDto,
  UserDto,
  UserGetDto,
  UserLoginDto,
  UserLoginResponseDto,
  UserResponseDto,
  UserUpdateDto,
} from './Dto/user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from './guard/admin.auth.guard';
import { StaffAuthGuard } from './guard/staff.auth.guard';
import { PlayerGetDto, PlayerUpdateDto } from '../player/Dto/player.dto';
import { PlayerService } from '../player/player.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly playerService: PlayerService,
  ) {}

  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Get a specific user for the given id `,
  })
  @Get('/:id')
  @ApiResponse({ type: UserGetDto })
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all the Users',
  })
  @ApiQuery({ name: 'searchKey', required: false, type: String })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @Get()
  @ApiResponse({ type: PaginatedResponseDto })
  getAllUsers(
    @Query('searchKey') searchKey = '',
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 10,
  ) {
    const skip = page ? (page - 1) * pageSize : 0;
    return this.userService.getAllUsers(searchKey, pageSize, skip);
  }
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Adding a new user ( admin/staff )',
    description: '**role must be one of the following values: admin, staff**',
  })
  @Post()
  @ApiResponse({
    type: UserResponseDto,
  })
  addUser(@Body() userDto: UserDto) {
    return this.userService.addUser(userDto);
  }

  @Post('seed')
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Seed the first admin user',
    description: '**This only works if there is no admin present**',
  })
  seedAdmin(@Body() seedDto: SeedDto) {
    return this.userService.seedAdmin(seedDto);
  }

  @Post('login')
  @ApiResponse({
    type: UserLoginResponseDto,
  })
  @ApiOperation({
    summary: 'User(admin/staff) login',
  })
  loginUser(@Body() loginDto: UserLoginDto) {
    return this.userService.loginUser(loginDto);
  }

  @Post('generaterefresh')
  @ApiResponse({ type: RefreshResponseDto })
  @ApiOperation({
    summary: 'generate a new access and refresh token',
  })
  expireRefreshToken(@Body() refreshDto: RefreshDto) {
    console.log(refreshDto);
    return this.userService.generateNewTokens(refreshDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Updating the user data of given id',
    description: '**role must be one of the following values: admin, staff**',
  })
  @Put('/:id')
  @ApiResponse({ type: UserResponseDto })
  updateUser(@Body() userDto: UserUpdateDto, @Param('id') id: string) {
    return this.userService.updateUser(id, userDto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a specific user with given id',
  })
  @Delete('/:id')
  @ApiResponse({ type: UserResponseDto })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin route to delete a player' })
  @ApiResponse({ type: UserResponseDto })
  @ApiBearerAuth()
  @Delete('player/:id')
  async deletePlayer(@Param('id') id: string) {
    return this.playerService.deletePlayer(id);
  }

  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: 'Admin route to update a player' })
  @ApiResponse({ type: UserResponseDto })
  @ApiBearerAuth()
  @Put('player/:id')
  async updatePlayer(
    @Body() playerData: PlayerUpdateDto,
    @Param('id') id: string,
  ) {
    return this.playerService.updatePlayer(id, playerData);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserResponseDto })
  @ApiOperation({
    summary: 'Set the player to inactive state',
  })
  @Patch('/player/setInactive/:id')
  setInactive(@Param('id') id: string) {
    return this.playerService.setInactive(id);
  }

  @UseGuards(StaffAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'searchKey', required: false, type: String })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'pageSize', required: true, type: Number })
  @ApiQuery({ name: 'country', required: false, type: String })
  @Get('players')
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

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: PlayerGetDto })
  @ApiOperation({
    summary: 'Admin/staff route to get a user',
  })
  getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }
}
