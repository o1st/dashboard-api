import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.service.interface';
import { TYPES } from './types';
import { IUsersController } from './users/users.controller.interface';
import { UserController } from './users/users.controller';
import { Container, ContainerModule } from 'inversify';
import { UserService } from './users/user.service';
import { IUserService } from './users/user.service.interface';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule(({ bind }) => {
	bind<App>(TYPES.App).to(App);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
	bind<IUsersController>(TYPES.UserController).to(UserController);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();

	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.App);

	app.init();

	return { appContainer, app };
}

export const { appContainer, app } = bootstrap();
