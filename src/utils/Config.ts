import { config } from 'dotenv';
import logger from './Logger';

config();

export interface AppConfig {
  kafka: {
    brokers: string[];
    clientId: string;
    timeout: number;
    retries: number;
    retryDelayMs: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  test: {
    timeout: number;
    retries: number;
  };
  logging: {
    level: string;
  };
  env: string;
}

class ConfigManager {
  private static instance: ConfigManager;
  private _config: AppConfig;

  private constructor() {
    this._config = this.loadConfig();
    this.validateConfig();
    logger.info({ env: this._config.env }, 'Configuration loaded');
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public get config(): AppConfig {
    return { ...this._config };
  }

  private loadConfig(): AppConfig {
    return {
      kafka: {
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        clientId: process.env.KAFKA_CLIENT_ID || 'api-test-framework',
        timeout: parseInt(process.env.KAFKA_TIMEOUT || '30000', 10),
        retries: parseInt(process.env.KAFKA_RETRIES || '3', 10),
        retryDelayMs: parseInt(process.env.KAFKA_RETRY_DELAY_MS || '1000', 10),
      },
      api: {
        baseUrl: process.env.API_BASE_URL || 'https://api.escuelajs.co',
        timeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
        retries: parseInt(process.env.API_RETRIES || '3', 10),
      },
      test: {
        timeout: parseInt(process.env.TEST_TIMEOUT || '20000', 10),
        retries: parseInt(process.env.TEST_RETRIES || '1', 10),
      },
      logging: {
        level: process.env.LOG_LEVEL || 'info',
      },
      env: process.env.NODE_ENV || 'development',
    };
  }

  private validateConfig(): void {
    const errors: string[] = [];

    if (this._config.kafka.timeout <= 0) {
      errors.push('KAFKA_TIMEOUT must be positive');
    }

    if (this._config.api.timeout <= 0) {
      errors.push('API_TIMEOUT must be positive');
    }

    if (!this._config.api.baseUrl.startsWith('http')) {
      errors.push('API_BASE_URL must be a valid HTTP URL');
    }

    if (this._config.kafka.brokers.length === 0) {
      errors.push('At least one Kafka broker must be specified');
    }

    const validLogLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    if (!validLogLevels.includes(this._config.logging.level)) {
      errors.push(`LOG_LEVEL must be one of: ${validLogLevels.join(', ')}`);
    }

    if (errors.length > 0) {
      logger.error({ errors }, 'Configuration validation failed');
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }
}

export const getConfig = (): AppConfig => ConfigManager.getInstance().config;