import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNotEmptyObject, isNotEmptyObject, IsObject, isObject, IsString, ValidateNested } from "class-validator";

export class Company {
    @IsNotEmpty({ message: 'Id should not be empty' })
    _id: string;

    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name should not be empty!' })
    name: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ message: 'Skill should be not empty!' })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'Salary should not be empty!' })
    salary: number;

    @IsNotEmpty({ message: 'Quantity should not be empty!' })
    quantity: number;

    @IsNotEmpty({ message: 'Level should not be empty!' })
    level: string

    @IsNotEmpty({ message: 'Description should not be empty!' })
    description: string;

    @IsNotEmpty({ message: 'Start date should not be empty!' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Start Date must be date format' })
    startDate: Date;

    @IsNotEmpty({ message: 'End date should not be empty!' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Start Date must be date format' })
    endDate: Date;

    @IsNotEmpty({ message: 'Active status should not be empty!' })
    isActive: boolean;

}
