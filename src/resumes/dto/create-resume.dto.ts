import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;

    @IsNotEmpty({ message: 'UserId should not be empty' })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Url should not be empty' })
    url: string;

    @IsNotEmpty({ message: 'Email should not be empty' })
    status: string;

    @IsNotEmpty({ message: 'CompanyId should not be empty' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'JobId should not be empty' })
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
    @IsNotEmpty({ message: 'Url should not be empty' })
    url: string;

    @IsMongoId({ message: 'CompanyId is a mongo id' })
    @IsNotEmpty({ message: 'CompanyId should not be empty' })
    companyId: mongoose.Schema.Types.ObjectId;


    @IsMongoId({ message: 'JobId is a mongo id' })
    @IsNotEmpty({ message: 'JobId should not be empty' })
    jobId: mongoose.Schema.Types.ObjectId;
}
