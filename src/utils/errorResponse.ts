import { HttpException, HttpStatus, Logger } from '@nestjs/common';

const logger = new Logger('ErrorLogger');

export const ErrorResponse = (
  error: any,
  status: HttpStatus = HttpStatus.BAD_REQUEST,
) => {
  if (typeof error === 'string') {
    logger.error(`Error: ${error}`);
    throw new HttpException(error, status);
  }

  logger.error(`Error: ${error.message}`, error.stack);
  throw new HttpException(error.message, error.status || status);
};
