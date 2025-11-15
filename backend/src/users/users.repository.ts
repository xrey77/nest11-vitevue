import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

export interface UserRepository extends Repository<User> {
  this: Repository<User>;
  createUser(userData: any): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmailadd(username: string): Promise<User | null>;  
}

export const customUserRepositoryMethods: Pick<UserRepository, 
'createUser' | 'findByUsername' | 'findByEmailadd'> = {

  findByUsername(this: Repository<User>, username: string) {
    return this.findOneBy({ username });
  },

  findByEmailadd(this: Repository<User>, email: string) {
    return this.findOneBy({ email });
  },

  createUser(userData: any) {
      const newUser = this.create(userData);
      return this.save(newUser);
  },

};



