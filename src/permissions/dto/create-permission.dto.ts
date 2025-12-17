import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;

    @IsNotEmpty({ message: 'ApiPath should not be empty' })
    apiPath: string;

    @IsNotEmpty({ message: 'Method should not be empty' })
    method: string;

    @IsNotEmpty({ message: 'Module should not be empty' })
    module: string;
}
