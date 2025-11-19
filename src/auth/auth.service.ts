import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(userName: string, password: string) {
        const user = await this.usersService.findOneByUserName(userName);

        if (user) {
            const isValid = this.usersService.isValidPassWord(password, user.password);

            if (isValid === true) {
                return user;
            }
        }
        return null;
    }

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role,
        }
    }

    async register(register: RegisterUserDto) {
        let user = await this.usersService.register(register);

        return {
            _id: user?._id,
            createdAt: user?.createdAt
        };
    }
}
