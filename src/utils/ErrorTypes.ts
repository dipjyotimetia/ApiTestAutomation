export enum ErrorCategory {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT', 
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  KAFKA = 'KAFKA',
  CONFIG = 'CONFIG',
  RESOURCE = 'RESOURCE',
  UNKNOWN = 'UNKNOWN'
}

export interface TestError {
  category: ErrorCategory;
  code: string;
  message: string;
  originalError?: Error | undefined;
  retryable: boolean;
  context?: Record<string, any> | undefined;
}

export class TestFrameworkError extends Error {
  public readonly category: ErrorCategory;
  public readonly code: string;
  public readonly retryable: boolean;
  public readonly context?: Record<string, any> | undefined;
  public readonly originalError?: Error | undefined;

  constructor(testError: TestError) {
    super(testError.message);
    this.name = 'TestFrameworkError';
    this.category = testError.category;
    this.code = testError.code;
    this.retryable = testError.retryable;
    this.context = testError.context;
    this.originalError = testError.originalError;
  }

  public static fromError(error: Error, category: ErrorCategory = ErrorCategory.UNKNOWN): TestFrameworkError {
    return new TestFrameworkError({
      category,
      code: error.name || 'UNKNOWN_ERROR',
      message: error.message,
      originalError: error,
      retryable: false
    });
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      category: this.category,
      code: this.code,
      message: this.message,
      retryable: this.retryable,
      context: this.context,
      stack: this.stack
    };
  }
}

export class ErrorClassifier {
  public static classify(error: any): TestFrameworkError {
    if (error instanceof TestFrameworkError) {
      return error;
    }

    // Network errors
    if (this.isNetworkError(error)) {
      return new TestFrameworkError({
        category: ErrorCategory.NETWORK,
        code: error.code || 'NETWORK_ERROR',
        message: `Network error: ${error.message}`,
        originalError: error,
        retryable: true,
        context: { errorCode: error.code, syscall: error.syscall }
      });
    }

    // Timeout errors
    if (this.isTimeoutError(error)) {
      return new TestFrameworkError({
        category: ErrorCategory.TIMEOUT,
        code: 'TIMEOUT',
        message: `Operation timed out: ${error.message}`,
        originalError: error,
        retryable: true
      });
    }

    // Authentication errors
    if (this.isAuthError(error)) {
      return new TestFrameworkError({
        category: ErrorCategory.AUTHENTICATION,
        code: 'AUTH_ERROR',
        message: `Authentication failed: ${error.message}`,
        originalError: error,
        retryable: false,
        context: { statusCode: error.status }
      });
    }

    // Kafka errors
    if (this.isKafkaError(error)) {
      return new TestFrameworkError({
        category: ErrorCategory.KAFKA,
        code: error.code || 'KAFKA_ERROR',
        message: `Kafka error: ${error.message}`,
        originalError: error,
        retryable: true
      });
    }

    // Default to unknown
    return new TestFrameworkError({
      category: ErrorCategory.UNKNOWN,
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      originalError: error,
      retryable: false
    });
  }

  private static isNetworkError(error: any): boolean {
    const networkCodes = ['ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNABORTED'];
    return networkCodes.includes(error.code);
  }

  private static isTimeoutError(error: any): boolean {
    return error.code === 'ETIMEDOUT' || 
           error.timeout === true || 
           error.message?.includes('timeout') ||
           error.message?.includes('timed out');
  }

  private static isAuthError(error: any): boolean {
    return error.status === 401 || error.status === 403;
  }

  private static isKafkaError(error: any): boolean {
    return error.message?.includes('Kafka') || 
           error.name?.includes('Kafka') ||
           error.type?.includes('kafka');
  }
}