import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class ResponseSse {
  @ApiProperty()
  data: string;
}
