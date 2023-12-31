import { EmailOptions } from '@/dtos/email-options';
import { User } from '@/entities/user';
import { Right } from '@/shared/either';
import { MailServiceError } from '@/usecases/errors/mail-service-error';
import { SendEmailUseCase } from '@/usecases/send-email/send-email-use-case';

import {
  mailOptions,
  emailData,
} from '../../fixtures/stubs/email-options-stub';
import { MailServiceErrorStub } from '../../fixtures/stubs/mail-service-error-stub';
import { MailServiceStub } from '../../fixtures/stubs/mail-service-stub';

const loggerService = {
  log: jest.fn(),
};

describe('Register and send email to user use case', () => {
  it('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub();

    const sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceStub,
      loggerService
    );

    const user = User.create({
      name: emailData.toName,
      email: emailData.toEmail,
    }).value as User;

    const response = await sendEmailUseCase.perform(user);
    const objectValueResponse = response.value as EmailOptions;

    expect(objectValueResponse.to).toEqual(
      `${emailData.toName}<${emailData.toEmail}>`
    );
    expect(response).toBeInstanceOf(Right);
  });

  it('should return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub();
    const sendEmailUseCase = new SendEmailUseCase(
      mailOptions,
      mailServiceErrorStub,
      loggerService
    );

    const user = User.create({
      name: emailData.toName,
      email: emailData.toEmail,
    }).value as User;

    const response = await sendEmailUseCase.perform(user);

    expect(response.value).toBeInstanceOf(MailServiceError);
  });
});
