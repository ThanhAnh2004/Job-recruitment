import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class JobsService {

  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUser) {

    let newJob = await this.jobModel.create({
      name: createJobDto.name,
      skills: createJobDto.skills,
      company: createJobDto.company,
      salary: createJobDto.salary,
      quantity: createJobDto.quantity,
      level: createJobDto.level,
      description: createJobDto.description,
      startDate: createJobDto.startDate,
      endDate: createJobDto.endDate,
      isActive: createJobDto.isActive,
      createdBy: {
        _id: user._id,
        email: user.email,
      }
    })
    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {

    // const job = this.jobModel.findById(id);
    // if (!job)
    //   throw new BadRequestException(`Not found a job by id: ${id}`);

    const updateJob = await this.jobModel.updateOne({ _id: id }, {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      }
    })
    return updateJob;
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
