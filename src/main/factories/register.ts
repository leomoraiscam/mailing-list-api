import { WinstonLoggerService } from '@/external/logger-services/wintson-logger-services';
import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service';
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository';
import { RegisterUserAndSendEmailUseCase } from '@/usecases/register-user-and-send-email/register-user-and-send-email-use-case';
import { RegisterUserOnMailingListUseCase } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list-use-case';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';
import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller';

import { getEmailOptions } from '../config/email';

export const makeRegisterUserAndSendEmailController =
  (): RegisterUserAndSendEmailController => {
    const mongodbUserRepository = new MongodbUserRepository();
    const loggerService = new WinstonLoggerService();
    const emailService = new NodemailerEmailService(loggerService);
    const registerUserOnMailingListUseCase =
      new RegisterUserOnMailingListUseCase(
        mongodbUserRepository,
        loggerService
      );
    const sendEmailUseCase = new SendEmailUseCase(
      getEmailOptions(),
      emailService,
      loggerService
    );
    const registerUserAndSendEmailUseCase = new RegisterUserAndSendEmailUseCase(
      registerUserOnMailingListUseCase,
      sendEmailUseCase,
      loggerService
    );
    const registerUserAndSendEmailController =
      new RegisterUserAndSendEmailController(registerUserAndSendEmailUseCase);

    return registerUserAndSendEmailController;
  };
