import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {

  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createUserCvDto;
    const { _id, email } = user;

    const newCv = await this.resumeModel.create({
      url, companyId, jobId, email,
      userId: _id,
      status: 'PENDING',
      createdBy: {
        _id, email,
      },
      history: [{
        status: 'PENDING',
        updatedAt: new Date,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
      ]
    })

    return {
      _id: newCv?.id,
      createdAt: newCv?.createdAt
    }
  }

  async updateStatus(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException('Not found resume')

    const updateCv = await this.resumeModel.updateOne(
      { _id },
      {
        status: status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      },
    )

    return updateCv;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Not found resume')
    }

    const resume = await this.resumeModel.findById({ _id: id })

    return resume
  }

  async delete(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Not found resume')
    }

    await this.resumeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )

    return this.resumeModel.softDelete({
      _id: id
    })
  }

  async findByUser(user: IUser) {
    return await this.resumeModel.find(
      { userId: user._id },
    )
  }
}
