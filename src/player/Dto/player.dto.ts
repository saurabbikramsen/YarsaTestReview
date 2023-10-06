import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Country } from '../../enums/enums';

export class PlayerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: ['np', 'in', 'us', 'au', 'af'],
  })
  @IsEnum(Country)
  country: Country;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string;
}

export class PlayerUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @ApiProperty({ enum: ['np', 'in', 'us', 'au', 'af'] })
  @IsEnum(Country)
  country: Country;
}

export class PlayerLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class PlayDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class Statistics {
  @ApiProperty()
  id: string;

  @ApiProperty()
  experience_point: number;

  @ApiProperty()
  games_played: number;

  @ApiProperty()
  games_won: number;
}
export class PlayerGetDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  stats_id: string;

  @ApiProperty()
  statistics: Statistics;
}

export class PlayerLeaderboardDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  statistics: Statistics;
}
