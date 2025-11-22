import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { response, Response } from 'express';
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
            maxAge: ms(this.configservice.get<string>('JWT_REFRESH_EXPIRE')) * 1000
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

    async processNewToken(refreshToken: string, response: Response) {
        try {
            let verify = this.jwtService.verify(refreshToken, {
                secret: this.configservice.get<string>('JWT_REFRESH_TOKEN')
            })

            let user = await this.usersService.findUserByToken(refreshToken);

            if (user) {
                const payload = {
                    sub: 'token refresh',
                    iss: 'from server',
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
                const newRefreshToken = this.createRefreshToken(payload);
                // update user with refresh token 
                await this.usersService.updateUserToken(newRefreshToken, user._id.toString());

                // set refresh token as cookies
                response.clearCookie('refresh_token');
                response.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    maxAge: ms(this.configservice.get<string>('JWT_REFRESH_EXPIRE')) * 1000
                })

                return {
                    accessToken: this.jwtService.sign(payload),
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }


            } else {
                throw new BadRequestException('Not found user');
            }


        } catch (error) {
            throw new BadRequestException('Invalid token. Please login!');
        }
    }

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken('', user._id);
        response.clearCookie('refresh_token');
        return 'ok';
    }
}
