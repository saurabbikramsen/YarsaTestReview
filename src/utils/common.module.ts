import { Global, Module } from '@nestjs/common';
import { CommonUtils } from './common.utils';
import { UtilsController } from './utils.controller';

@Global()
@Module({
  providers: [CommonUtils],
  controllers: [UtilsController],
  exports: [CommonUtils],
})
export class CommonModule {}
