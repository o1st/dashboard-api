import { App } from "./app";
import { ExceptionFilter } from "./errors/exception.filter";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import { LoggerService } from "./logger/logger.service";
import { ILogger } from "./logger/logger.service.interface";
import { TYPES } from "./types";
import { IUsersController } from "./users/users.controller.interface";
import { UserController } from "./users/users.controller";
import { Container, ContainerModule } from "inversify";

export const appBindings = new ContainerModule(({ bind }) => {
    bind<App>(TYPES.App).to(App);
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IUsersController>(TYPES.UserController).to(UserController);
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
});

function bootstrap() {
    const appContainer = new Container();

    appContainer.load(appBindings);

    const app = appContainer.get<App>(TYPES.App);
    app.init();

    return { appContainer, app };
}

export const { appContainer, app } = bootstrap();
