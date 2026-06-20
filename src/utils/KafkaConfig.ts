import { KafkaTestOptions } from '../helpers/KafkaTestHelper';

export class KafkaConfig {
  static getDefaultOptions(): KafkaTestOptions {
    return {
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
      clientId: process.env.KAFKA_CLIENT_ID || 'api-test-framework',
      timeout: parseInt(process.env.KAFKA_TIMEOUT || '30000'),
      retry: {
        attempts: parseInt(process.env.KAFKA_RETRY_ATTEMPTS || '3'),
        delayMs: parseInt(process.env.KAFKA_RETRY_DELAY || '1000')
      }
    };
  }

  static createTestHelper(): import('../helpers/KafkaTestHelper').KafkaTestHelper {
    const { KafkaTestHelper } = require('../helpers/KafkaTestHelper');
    return new KafkaTestHelper(KafkaConfig.getDefaultOptions());
  }
}