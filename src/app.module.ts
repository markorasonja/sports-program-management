import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SportsModule } from './sports/sports.module';
import { ClassesModule } from './classes/classes.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [ConfigModule, CommonModule, AuthModule, UsersModule, SportsModule, ClassesModule, ApplicationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
