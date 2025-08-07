import { App } from "./app";
import { ExceptionFilter } from "./errors/exception.filter";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/users.controller";

async function bootstrap() {
    const logger = new LoggerService();
    const userController = new UserController(logger);
    const exceptionFilter = new ExceptionFilter(logger);

    const app = new App(logger, userController, exceptionFilter);
    await app.init();
}

bootstrap();
