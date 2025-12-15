import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    let detailedMessage = exception.message;

    if (typeof exceptionResponse === 'string') {
      detailedMessage = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse['message']
    ) {
      detailedMessage = exceptionResponse['message'][0].constraints.matches;
    }

    const apiResponse = new ApiResponseDto({
      data: null,
      message: detailedMessage,
      error: true,
      timestamp: new Date().toISOString(),
      path: request.url,
      status,
    });

    response.status(status).json(apiResponse);
  }
}
