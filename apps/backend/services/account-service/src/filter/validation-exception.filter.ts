import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Validation failed';
    let validationErrors: any = null;

    if (
      Array.isArray(exceptionResponse) &&
      exceptionResponse[0] instanceof ValidationError
    ) {
      validationErrors = this.formatValidationErrors(exceptionResponse);
      message = this.getFirstErrorMessage(validationErrors) || message;
    } else if (
      typeof exceptionResponse === 'object' &&
      Array.isArray(exceptionResponse['message'])
    ) {
      const responseMessage = exceptionResponse['message'];
      if (responseMessage[0] instanceof ValidationError) {
        validationErrors = this.formatValidationErrors(responseMessage);
        message = this.getFirstErrorMessage(validationErrors) || message;
      }
    } else if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const responseMessage = exceptionResponse['message'];

      if (Array.isArray(responseMessage)) {
        validationErrors = { errors: responseMessage };
        message = responseMessage[0] || message;
      } else if (typeof responseMessage === 'string') {
        message = responseMessage;
      }
    }

    const apiResponse = new ApiResponseDto({
      data: null,
      message,
      error: true,
      timestamp: new Date().toISOString(),
      path: request.url,
      status,
    });

    response.status(status).json(apiResponse);
  }

  private formatValidationErrors(errors: ValidationError[]): any {
    return errors.reduce((acc, error) => {
      const messages = Object.values(error.constraints || {});
      acc[error.property] = {
        value: error.value,
        constraints: error.constraints,
        messages: messages,
      };
      return acc;
    }, {});
  }

  private getFirstErrorMessage(validationErrors: any): string | null {
    if (!validationErrors) return null;

    for (const field of Object.keys(validationErrors)) {
      const fieldErrors = validationErrors[field];

      if (fieldErrors.messages && fieldErrors.messages.length > 0) {
        return fieldErrors.messages[0];
      }

      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        return fieldErrors[0];
      }

      if (typeof fieldErrors === 'string') {
        return fieldErrors;
      }
    }

    return null;
  }
}
