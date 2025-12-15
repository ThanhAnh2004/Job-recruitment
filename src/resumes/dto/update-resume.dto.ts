import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdatedBy {
    @IsNotEmpty()
    _id: string

    @IsNotEmpty()
    updatedAt: Date

    @IsNotEmpty()
    @IsEmail()
    email: string
}

class History {
    @IsNotEmpty()
    status: string

    @IsNotEmpty()
    updatedAt: Date

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: 'History is not be empty' })
    @IsArray({ message: 'History must be Array' })
    @ValidateNested()
    @Type(() => History)
    history: History[];
}
