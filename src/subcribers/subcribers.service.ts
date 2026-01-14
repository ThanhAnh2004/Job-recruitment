import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber, SubcriberDocument } from './schemas/subcriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class SubcribersService {
  constructor(@InjectModel(Subcriber.name) private subcriberModel: SoftDeleteModel<SubcriberDocument>) { }

  async create(createSubcriberDto: CreateSubcriberDto, user: IUser) {

    const isExist = await this.subcriberModel.findOne({ email: createSubcriberDto.email })
    if (isExist) {
      throw new BadRequestException(`Email: ${createSubcriberDto.email} already exist`);
    }

    const newSubcriber = await this.subcriberModel.create({
      email: createSubcriberDto.email,
      name: createSubcriberDto.name,
      skills: createSubcriberDto.skills,
      createdBy: {
        _id: user._id,
        name: user.name
      }
    })

    return newSubcriber;
  }

  findAll() {
    return `This action returns all subcribers`;
  }

  async findOne(id: string) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found subcriber with id ${id}`);
    }

    const subcriber = await this.subcriberModel.findById(id);
    return subcriber;
  }

  async update(id: string, updateSubcriberDto: UpdateSubcriberDto, user: IUser) {
    const { email, name, skills } = updateSubcriberDto;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found subcriber with id: ${id}`)
    }

    const subcriber = await this.subcriberModel.updateOne(
      { _id: id },
      {
        email, name, skills,
        updatedBy: {
          _id: user._id,
          name: user.name
        }
      }
    )
    return subcriber
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found subcriber with id: ${id}`)
    }

    const subcriber = await this.subcriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        }
      }
    )

    return this.subcriberModel.softDelete({ _id: id })
  }
}
