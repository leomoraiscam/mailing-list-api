import { UserData } from '@/dtos/user-data';

import { MissingParamError } from './errors/missing-param-error';
import { badRequest, created, serverError } from './helper/http-helper';
import { HttpRequest } from './ports/http-request';
import { HttpResponse } from './ports/http-response';

export interface UseCase {
  perform(request: any): Promise<any>;
}

export class RegisterUserAndSendEmailController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: HttpRequest<UserData | Partial<UserData>>
  ): Promise<HttpResponse<UserData | Error>> {
    try {
      if (!request.body.name || !request.body.email) {
        let missing = !request.body.name ? 'name ' : '';

        missing += !request.body.email ? 'email' : '';

        return badRequest<Error>(new MissingParamError(missing.trim()));
      }

      const userData = request.body as UserData;
      const response = await this.usecase.perform(userData);

      if (response.isLeft()) {
        return badRequest<Error>(response.value);
      }

      return created<UserData>(response.value);
    } catch (error) {
      return serverError<Error>(error);
    }
  }
}
