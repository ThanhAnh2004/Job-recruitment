import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;

    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string;

    @IsNotEmpty({ message: 'IsActive should not be empty' })
    @IsBoolean({ message: 'IsActive must be true or false' })
    isActive: boolean;

    @IsNotEmpty({ message: 'Permissions should not be empty' })
    @IsArray({ message: 'Permission must be array' })
    @IsMongoId({ each: true, message: 'Each permission must be object id' })
    permissions: mongoose.Types.ObjectId[];
}
