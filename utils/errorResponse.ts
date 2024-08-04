import { HttpException, HttpStatus } from '@nestjs/common';

export const ErrorResponse = (
  error: any,
  status: HttpStatus = HttpStatus.BAD_REQUEST,
) => {
  if (typeof error === 'string') {
    throw new HttpException(error, status);
  }

  throw new HttpException(error.message, error.status || status);
};
