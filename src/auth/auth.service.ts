import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configservice: ConfigService,
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

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refreshToken = this.createRefreshToken(payload);

        // Update user with refresh token
        await this.usersService.updateUserToken(refreshToken, _id);

        // Set refresh token as cookies
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: ms(this.configservice.get<string>('JWT_REFRESH_EXPIRE'))
        });


        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
            }
        }
    }

    async register(register: RegisterUserDto) {
        let user = await this.usersService.register(register);

        return {
            _id: user?._id,
            createdAt: user?.createdAt
        };
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configservice.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configservice.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
        });
        return refreshToken
    }
}
