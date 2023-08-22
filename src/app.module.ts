import { Logger, Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrachEntity } from './models/branch.entity';
import { BranchController } from './controllers/branch.controller';
import { VideoEntity } from './models/video.entity';
import { VideoController } from './controllers/video.controller';
import { UserEntity } from './models/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        entities: [BrachEntity, VideoEntity, UserEntity],
      }),
    }),
    TypeOrmModule.forFeature([BrachEntity, VideoEntity, UserEntity]),
  ],
  controllers: [AppController, BranchController, VideoController],
  providers: [Logger, LocalStrategy, LocalAuthGuard],
})
export class AppModule {}
