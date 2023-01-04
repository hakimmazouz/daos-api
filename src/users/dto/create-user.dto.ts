import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsEqualTo } from 'src/decorators/IsEqualTo.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Must be longer than 2 characters' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Must be longer than 8 characters' })
  password: string;

  @IsEqualTo<CreateUserDto>('password')
  passwordConfirmation: string;

  @IsNotEmpty({ message: 'Location is required' })
  location: string;
}
