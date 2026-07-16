import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { ItemsModule } from './items/items.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AuthModule, UsersModule, ListsModule, ItemsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
