import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import type { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,

  ) {}  

  async findUserByEmail(email: string): Promise<User | null | undefined> {
    return await this.userRepository.findByEmailadd(email);
  }  

  async registerUser(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData); // Use built-in create    
    return this.userRepository.save(newUser);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async getUserByEmailadd(email: string): Promise<User | null> {
    return this.userRepository.findByEmailadd(email);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({id});
  }

  async getAllUsers(): Promise<User[] | null> {
    return this.userRepository.find();
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);    
  }  

  async updatePassword(id: number, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(user, {password});
    return this.userRepository.save(updatedUser);    
  }  

  async updateProfilepic(id: number, userpic: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(user, {userpic});
    return this.userRepository.save(updatedUser);    
  }  

  async updateMfa(id: number, secret: any, qrcodeurl: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(user, {secret}, {qrcodeurl});
    return this.userRepository.save(updatedUser);    
  }  



  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }  
}
