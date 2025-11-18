import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Email should not be empty!' })
    email: string;

    @IsNotEmpty({ message: "Password should not be empty!" })
    password: string;
    name: string;
    address: string;
}
