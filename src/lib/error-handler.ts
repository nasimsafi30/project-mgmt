export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public userMessage: string;
  public metadata?: Record<string, any>;

  constructor({
    message,
    code = 'UNKNOWN_ERROR',
    statusCode = 500,
    userMessage = 'An unexpected error occurred',
    metadata,
  }: {
    message: string;
    code?: string;
    statusCode?: number;
    userMessage?: string;
    metadata?: Record<string, any>;
  }) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    this.metadata = metadata;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super({
      message: `${resource} not found`,
      code: 'NOT_FOUND',
      statusCode: 404,
      userMessage: `${resource} not found`,
    });
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super({
      message,
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      userMessage: message,
      metadata,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super({
      message,
      code: 'UNAUTHORIZED',
      statusCode: 401,
      userMessage: 'You are not authorized to perform this action',
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super({
      message,
      code: 'FORBIDDEN',
      statusCode: 403,
      userMessage: 'You do not have permission to access this resource',
    });
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super({
      message: 'Rate limit exceeded',
      code: 'RATE_LIMIT',
      statusCode: 429,
      userMessage: `Too many requests. Please try again${retryAfter ? ` in ${retryAfter} seconds` : ' later'}.`,
    });
  }
}

export function handleApiError(error: unknown): { status: number; body: any } {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        error: error.code,
        message: error.userMessage,
        details: error.message,
      },
    };
  }

  console.error('Unhandled error:', error);
  return {
    status: 500,
    body: {
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };
}

export async function tryCatch<T>(fn: () => Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const data = await fn();
    return [data, null];
  } catch (error) {
    return [null, error as Error];
  }
}