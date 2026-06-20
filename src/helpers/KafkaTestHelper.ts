import { Producer, Consumer, Admin } from '@platformatic/kafka';
import logger from '../utils/Logger';

export interface KafkaTestOptions {
  brokers: string[];
  clientId?: string;
  timeout?: number;
  retry?: {
    attempts?: number;
    delayMs?: number;
  };
}

export interface ProduceMessageOptions {
  topic: string;
  messages: Array<{
    key?: string;
    value: string | Buffer | object;
    partition?: number;
    headers?: Record<string, string>;
    timestamp?: string;
  }>;
  acks?: number;
  timeout?: number;
}

export interface ConsumeMessageOptions {
  topic: string;
  groupId: string;
  fromBeginning?: boolean;
  timeout?: number;
  maxMessages?: number;
  autoCommit?: boolean;
}

export interface ConsumedMessage {
  topic: string;
  partition: number;
  offset: string;
  key: Buffer | null;
  value: Buffer | null;
  timestamp: string;
  headers?: Record<string, Buffer>;
}

export class KafkaTestHelper {
  private producer: any = null;
  private consumer: any = null;
  private admin: any = null;
  private options: Required<KafkaTestOptions>;

  constructor(options: KafkaTestOptions) {
    this.options = {
      brokers: options.brokers,
      clientId: options.clientId || 'kafka-test-client',
      timeout: options.timeout || 30000,
      retry: {
        attempts: options.retry?.attempts || 3,
        delayMs: options.retry?.delayMs || 1000,
        ...options.retry
      }
    };
  }

  async connect(): Promise<void> {
    try {
      this.producer = new Producer({
        clientId: this.options.clientId,
        bootstrapBrokers: this.options.brokers
      });

      this.admin = new Admin({
        clientId: this.options.clientId + '-admin',
        bootstrapBrokers: this.options.brokers
      });
    } catch (error) {
      throw new Error(`Failed to connect to Kafka: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.consumer) {
        await this.consumer.close();
      }
      if (this.producer) {
        await this.producer.close();
      }
      if (this.admin) {
        await this.admin.close();
      }
    } catch (error) {
      logger.warn({ error }, 'Error disconnecting from Kafka');
    }
  }

  async publishMessage(options: ProduceMessageOptions): Promise<void> {
    if (!this.producer) {
      throw new Error('Producer not connected. Call connect() first.');
    }

    try {
      const messages = options.messages.map(msg => ({
        topic: options.topic,
        key: msg.key,
        value: typeof msg.value === 'object' ? JSON.stringify(msg.value) : String(msg.value),
        partition: msg.partition,
        headers: msg.headers,
        timestamp: msg.timestamp,
      }));

      await this.producer.send({ messages });
    } catch (error) {
      throw new Error(`Failed to publish message to topic ${options.topic}: ${error}`);
    }
  }

  async publishMessages(topics: string[], message: string | object): Promise<void> {
    const messageValue = typeof message === 'object' ? JSON.stringify(message) : String(message);
    
    for (const topic of topics) {
      await this.publishMessage({
        topic,
        messages: [{
          value: messageValue,
          timestamp: new Date().toISOString(),
        }],
      });
    }
  }

  async consumeMessages(options: ConsumeMessageOptions): Promise<ConsumedMessage[]> {
    try {
      this.consumer = new Consumer({
        groupId: options.groupId,
        clientId: this.options.clientId + '-consumer',
        bootstrapBrokers: this.options.brokers
      });

      const stream = await this.consumer.consume({
        topics: [options.topic],
        autocommit: options.autoCommit !== false
      });

      const messages: ConsumedMessage[] = [];
      const maxMessages = options.maxMessages || 10;
      const timeout = options.timeout || this.options.timeout;

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          this.consumer?.close().then(() => {
            resolve(messages);
          });
        }, timeout);

        if (stream && typeof stream.on === 'function') {
          stream.on('data', (message: any) => {
            messages.push({
              topic: message.topic,
              partition: message.partition,
              offset: message.offset,
              key: message.key ? Buffer.from(message.key) : null,
              value: message.value ? Buffer.from(message.value) : null,
              timestamp: message.timestamp,
              headers: message.headers,
            });

            if (messages.length >= maxMessages) {
              clearTimeout(timeoutId);
              this.consumer?.close().then(() => {
                resolve(messages);
              });
            }
          });

          stream.on('error', reject);
        } else {
          clearTimeout(timeoutId);
          resolve(messages);
        }
      });
    } catch (error) {
      if (this.consumer) {
        await this.consumer.close();
      }
      throw new Error(`Failed to consume messages from topic ${options.topic}: ${error}`);
    }
  }

  async waitForMessage(
    topic: string,
    groupId: string,
    predicate: (message: ConsumedMessage) => boolean,
    timeoutMs: number = 30000
  ): Promise<ConsumedMessage | null> {
    const messages = await this.consumeMessages({
      topic,
      groupId,
      timeout: timeoutMs,
      maxMessages: 100,
    });

    return messages.find(predicate) || null;
  }

  async createTopic(topicName: string, numPartitions: number = 1, replicationFactor: number = 1): Promise<void> {
    if (!this.admin) {
      throw new Error('Admin not connected. Call connect() first.');
    }

    try {
      await this.admin.createTopics({
        topics: [topicName],
        partitions: numPartitions,
        replicas: replicationFactor,
      });
    } catch (error) {
      throw new Error(`Failed to create topic ${topicName}: ${error}`);
    }
  }

  async deleteTopic(topicName: string): Promise<void> {
    if (!this.admin) {
      throw new Error('Admin not connected. Call connect() first.');
    }

    try {
      await this.admin.deleteTopics({
        topics: [topicName],
      });
    } catch (error) {
      throw new Error(`Failed to delete topic ${topicName}: ${error}`);
    }
  }

  async listTopics(): Promise<string[]> {
    if (!this.admin) {
      throw new Error('Admin not connected. Call connect() first.');
    }

    try {
      const metadata = await this.admin.metadata({
        topics: [],
      });
      if (metadata && metadata.topics) {
        if (Array.isArray(metadata.topics)) {
          return metadata.topics.map((topic: any) => topic.name || topic);
        } else if (typeof metadata.topics === 'object') {
          return Array.from(Object.keys(metadata.topics));
        }
      }
      return [];
    } catch (error) {
      throw new Error(`Failed to list topics: ${error}`);
    }
  }

  parseMessage(message: ConsumedMessage): any {
    if (!message.value) {
      return null;
    }

    try {
      return JSON.parse(message.value.toString());
    } catch {
      return message.value.toString();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async retryOperation<T>(
    operation: () => Promise<T>,
    description: string = 'operation'
  ): Promise<T> {
    let lastError: any = new Error(`No attempts made for ${description}`);
    
    const maxAttempts = this.options.retry?.attempts || 3;
    const delayMs = this.options.retry?.delayMs || 1000;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          throw new Error(`Failed ${description} after ${attempt} attempts: ${error}`);
        }
        
        await this.delay(delayMs * attempt);
      }
    }
    
    throw lastError;
  }
}