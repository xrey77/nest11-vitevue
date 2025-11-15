import { FileInterceptor } from '@nestjs/platform-express';

//jwt 
import { JwtService } from '@nestjs/jwt';
//jwt verification
import { AuthGuard } from './users.authguard';

import { Controller, Get, Post, Body, Patch, Req, Param, Delete, HttpCode, HttpStatus, HttpException, BadRequestException, UseGuards, UseInterceptors, UploadedFile, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

//encrypt and verify password
import * as bcrypt from 'bcrypt';

import { SigninDto } from './dto/signin-dto';
import { updateDto } from './dto/update-dto';
//totp
import { AuthService } from 'src/auth/auth.service';

import { multerConfig } from '../utils/multer.config'; // Import the config
// import { diskStorage, memoryStorage } from 'multer';
// import { extname } from 'path';
// import { Request } from 'express';
import { ImageCompressionPipe } from 'src/utils/image-compression.pipe';

import path from 'path';

@Controller('users')
export class UsersController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService
    ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED) 
  async registration(@Body() userDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(userDto.password, saltOrRounds);        
    const user = new CreateUserDto();
    user.firstname = userDto.firstname;
    user.lastname = userDto.lastname;
    user.email = userDto.email;
    user.mobile = userDto.mobile;
    user.username = userDto.username;
    user.password = hash;
    user.userpic = "/images/pix.png";

    const _email = await this.usersService.findUserByEmail(userDto.email);
    if (_email !== null) {
      throw new HttpException(
        "Email Address is already taken.",
        HttpStatus.BAD_REQUEST,
      );      
    } 

    const _username = await this.usersService.getUserByUsername(userDto.username);
    if (_username !== null) {
      throw new HttpException(
        "Username is already taken.",
        HttpStatus.BAD_REQUEST,
      );      
    } 

    try {
      this.usersService.registerUser(user);
      return { 
        message: "Registration Successfull.",
        status: 200,
      };

    } catch(error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );      
    }
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK) 
  async userlogin(@Body() userDto: SigninDto) {

    const _username = await this.usersService.getUserByUsername(userDto.username);
    if (_username !== null) {

      const hash = _username.password;
      const isMatch = await bcrypt.compare(userDto.password, hash);
      if (isMatch) {

        const tokenkey = await this.jwtService.signAsync({ id: _username.id });
        const user = {
          message: 'Login Successful',
          id: _username.id,
          username: _username.username,
          roles: _username.roles,
          userpic: _username.userpic,
          qrcodeurl: _username.qrcodeurl,
          isactivated: _username.isactivated,
          isblocked: _username.isblocked,
          token: tokenkey
        }

        throw new HttpException(
          user,
          HttpStatus.OK,
        );      
  
      } else {
        throw new HttpException(
          "Invalid Password, please try again.",
          HttpStatus.BAD_REQUEST,
        );      
  
      }

    }  else {
      throw new HttpException(
        "Username does not exists, please register first.",
        HttpStatus.BAD_REQUEST,
      );      

    }

  }

  @UseGuards(AuthGuard)
  @Get('getuserid/:id')
  async getUserid(@Param('id') id: number) {
    const user: any = await this.usersService.getUserById(id);
    throw new HttpException(
      user,
      HttpStatus.OK,
    );          
  }

  @UseGuards(AuthGuard)
  @Get('getall')
  async getUsers() {
    const users: any = await this.usersService.getAllUsers();
    throw new HttpException(
      users,
      HttpStatus.OK,
    );          
  }

@UseGuards(AuthGuard)
@Patch('updateprofile/:id')
async updateUser(@Param('id') id: number, @Body() userDto: updateDto) {
  await this.usersService.updateUser(id, userDto);
  throw new HttpException(
    'Successfully updated.',
    HttpStatus.OK,
  );          
}

@UseGuards(AuthGuard)
@Delete('delete/:id')
async deleteUser(@Param('id')id: number) {
  await this.usersService.deleteUser(id);
  throw new HttpException(
    'User ID ${id} has been Successfully Deleted.',
    HttpStatus.OK,
  );          

}

@UseGuards(AuthGuard)
@Patch('changepassword/:id')
async changePassword(@Param('id') id: number, @Body() usr: string) {
  
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(usr['password'], saltOrRounds);        
  
  await this.usersService.updatePassword(id, hash);

  throw new HttpException(
    'Your password has succesffuly been changed. ',
    HttpStatus.OK,
  );          
}

@UseGuards(AuthGuard)
@Patch('uploadpicture/:id')
@UseInterceptors(FileInterceptor('userpic', multerConfig))
// @UseInterceptors(
//   FileInterceptor('userpic', {
//     storage: diskStorage({
//       destination: (req: Request, file, cb) => {
//         const uploadPath = `./public/users`;
//         cb(null, uploadPath);
//       },
//       filename: (req, file, cb) => {
//         const randomName = '00' + req.params.id;
//         cb(null, `${randomName}${extname(file.originalname)}`);
//       },
//     }),
//   }),
// )
async uploadProfilepic(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
  const newfile = `http://localhost:3000/users/${file.filename}`;
  await this.usersService.updateProfilepic(id, newfile);

  const data = {
    message: 'Your profile picture has been changed successfully.',
    userpic: newfile,
  }

  throw new HttpException(
    data,
    HttpStatus.OK,
  );          
}


@Patch('mfa/activate/:id')
async activatMfa(@Param('id') id: number, @Body() opt: boolean) {
  if (opt['Twofactorenabled']) {

    const user: any = await this.usersService.getUserById(id);
    if (user) {
      const usr = user['email'];
      const { secret, otpauthUrl } = await this.authService.generateTotpSecret(usr);
      const qrcode = await this.authService.generateQrCodeDataURL(otpauthUrl);
      await this.usersService.updateMfa(id, secret, qrcode);
      const data = {
        message: 'Multi-Factor has been enabled.',
        qrcodeurl: qrcode
      }
      
      throw new HttpException(
        data,
        HttpStatus.OK,
      );          
  
    } 

  
  } else {
    
    await this.usersService.updateMfa(id, null, null);
    throw new HttpException(
      'Multi-Factor has been disabled.',
      HttpStatus.OK,
    );          
  
  }
}

  @Patch('verifytotp/:id')
  async verifyTotp(@Param('id')id: number, @Body('token') token: string) {
    const user: any = await this.usersService.getUserById(id);
    if (user) {

      const userSecret = user['secret'];
      const isValid: any =  this.authService.verifyTotpToken(token, userSecret);
      if (!isValid) {
        throw new UnauthorizedException('Invalid OTP code, try again.');
      } 
      const usrname = user['username'];
      return { 
        message: 'OTP code verified successfully.',
        username: usrname
      };
  
    } else {

      throw new HttpException(
        'User not found.',
        HttpStatus.BAD_REQUEST,
      );          

    }
  }  



}

