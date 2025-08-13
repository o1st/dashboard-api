import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email address' })
	email: string;

	@IsString({ message: 'Password is required' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string;

	@IsString({ message: 'Name is required' })
	name: string;
}
