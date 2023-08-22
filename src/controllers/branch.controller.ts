import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Render,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { BrachEntity } from 'src/models/branch.entity';
import { CreateBranchDto } from 'src/requests/create-branch.dto';
import { Repository } from 'typeorm';

@Controller('branches')
export class BranchController {
  constructor(
    @InjectRepository(BrachEntity)
    private readonly branchRepository: Repository<BrachEntity>,
  ) {}

  @Get()
  @Render('branches/list')
  async getAllBranches() {
    const branches = await this.branchRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      branches,
    };
  }

  @Get('create')
  @Render('branches/create')
  showCreateBranch() {}

  @Get('edit/:id')
  @Render('branches/edit')
  async showEditBranch(@Param('id', new ParseUUIDPipe()) id: string) {
    const branch = await this.branchRepository.findOne({
      where: {
        id,
      },
    });

    if (!branch) throw new BadRequestException('Branch not found');

    return {
      branch,
    };
  }

  @Post('/')
  async createBranch(@Body() body: CreateBranchDto, @Res() res: Response) {
    await this.branchRepository.save({
      name: body.name,
      address: body.address,
    });
    res.redirect('/branches');
  }

  @Delete('/:id')
  async deleteBranch(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.branchRepository.delete({
      id,
    });
    return {
      message: 'Branch deleted successfully',
    };
  }

  @Post('/edit/:id')
  async updateBranch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CreateBranchDto,
    @Res() res: Response,
  ) {
    await this.branchRepository.update(
      {
        id,
      },
      {
        name: body.name,
        address: body.address,
      },
    );
    res.redirect('/branches');
  }
}
