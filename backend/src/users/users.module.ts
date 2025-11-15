// import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersController } from './users.controller';
import { TypeOrmModule, getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { customUserRepositoryMethods } from './users.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),    
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService], // Inject ConfigService into the factory
      global: true, // Makes JwtService available everywhere
    }),    
  ],  
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource.getRepository(User).extend(customUserRepositoryMethods);
      },
    },  
  ],
  exports: [getRepositoryToken(User)],  
})
export class UsersModule {}

// JwtModule.register({
//   secret: process.env.JWT_SECRET
// }),    
