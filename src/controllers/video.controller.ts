import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { BrachEntity } from 'src/models/branch.entity';
import { VideoEntity } from 'src/models/video.entity';
import { CreateVideoDto } from 'src/requests/create-video.dto';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Controller('videos')
@UseGuards(AuthGuard('local'))
export class VideoController {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(BrachEntity)
    private readonly branchRepository: Repository<BrachEntity>,
  ) {}

  @Get('/')
  @Render('videos/list')
  async getAllVideos() {
    const videos = await this.videoRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['branches'],
    });
    return {
      videos,
    };
  }

  @Get('/create')
  @Render('videos/create')
  async showCreateVideo() {
    const branches = await this.branchRepository.find();
    return {
      branches,
      today: new Date().toISOString().split('T')[0],
    };
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('video'))
  async createVideo(
    @UploadedFile() video: Express.Multer.File,
    @Res() res: Response,
    @Body() body: CreateVideoDto,
  ) {
    const fileName = `${uuidv4()}.${video.mimetype.split('/')[1]}`;
    const ws = createWriteStream(
      join(__dirname, '..', '..', '..', 'videos', fileName),
    );
    ws.write(video.buffer);
    ws.close();
    const branches = await this.branchRepository.find({
      where: {
        id: In(body.branches),
      },
    });
    await this.videoRepository.save({
      link: fileName,
      branches,
      startDate: body.startDate,
      endDate: body.endDate,
    });
    return res.redirect('/videos');
  }

  @Delete('/:id')
  async deleteVideo(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.videoRepository.delete({
      id,
    });
    return {
      message: 'Video deleted successfully',
    };
  }
}
