import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateSubcriberDto {
    @IsNotEmpty({ message: 'Email should not be empty!' })
    @IsEmail({ message: 'Email must be correct format' })
    email: string;

    @IsNotEmpty({ message: 'Name should not be empty!' })
    name: string;

    @IsNotEmpty({ message: 'Skills should not be empty!' })
    skills: string[];
}
