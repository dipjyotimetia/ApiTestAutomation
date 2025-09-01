# Kafka Message Testing

This project now includes support for testing Kafka messages using the `@platformatic/kafka` library.

## Features

- **Message Publishing**: Send messages to Kafka topics with support for JSON and string payloads
- **Message Consumption**: Consume messages from Kafka topics with configurable timeouts and limits
- **Topic Management**: Create, delete, and list Kafka topics
- **Wait for Messages**: Wait for specific messages based on custom predicates
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Type Safety**: Full TypeScript support with proper interfaces

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure your Kafka settings:

```bash
cp .env.example .env
```

Update the `.env` file:
```
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=api-test-framework
KAFKA_TIMEOUT=30000
```

### 2. Basic Usage

```typescript
import { KafkaTestHelper } from './src/helpers/KafkaTestHelper';

// Create and connect to Kafka
const kafkaHelper = new KafkaTestHelper({
  brokers: ['localhost:9092'],
  clientId: 'test-client',
  timeout: 30000
});

await kafkaHelper.connect();

// Publish a message
await kafkaHelper.publishMessage({
  topic: 'test-topic',
  messages: [{
    key: 'user-123',
    value: { name: 'John', action: 'login' },
    headers: { 'content-type': 'application/json' }
  }]
});

// Consume messages
const messages = await kafkaHelper.consumeMessages({
  topic: 'test-topic',
  groupId: 'test-group',
  maxMessages: 10,
  timeout: 5000
});

// Clean up
await kafkaHelper.disconnect();
```

### 3. Advanced Features

#### Wait for Specific Messages

```typescript
const message = await kafkaHelper.waitForMessage(
  'user-events',
  'test-consumer-group',
  (msg) => {
    const parsed = kafkaHelper.parseMessage(msg);
    return parsed.userId === '123';
  },
  15000
);
```

#### Topic Management

```typescript
// Create a topic
await kafkaHelper.createTopic('new-topic', 3, 1); // 3 partitions, 1 replica

// List all topics
const topics = await kafkaHelper.listTopics();

// Delete a topic
await kafkaHelper.deleteTopic('old-topic');
```

#### Request-Response Pattern

```typescript
const correlationId = 'req-' + Date.now();

// Send request
await kafkaHelper.publishMessage({
  topic: 'requests',
  messages: [{
    key: correlationId,
    value: { action: 'getUserData', userId: 123 }
  }]
});

// Wait for response
const response = await kafkaHelper.waitForMessage(
  'responses',
  'response-consumer',
  (msg) => {
    const parsed = kafkaHelper.parseMessage(msg);
    return parsed.correlationId === correlationId;
  },
  10000
);
```

## Running Tests

The Kafka tests are included in the test suite. To run them:

```bash
# Make sure Kafka is running locally
npm test
```

Or run just the Kafka tests:

```bash
npx mocha src/tests/integration/kafka.test.ts
```

## Configuration Options

### KafkaTestOptions

```typescript
interface KafkaTestOptions {
  brokers: string[];           // Kafka broker addresses
  clientId?: string;           // Client identifier
  timeout?: number;            // Default timeout in ms
  retry?: {
    attempts?: number;         // Number of retry attempts
    delayMs?: number;          // Delay between retries
  };
}
```

### ProduceMessageOptions

```typescript
interface ProduceMessageOptions {
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
```

### ConsumeMessageOptions

```typescript
interface ConsumeMessageOptions {
  topic: string;
  groupId: string;
  fromBeginning?: boolean;
  timeout?: number;
  maxMessages?: number;
  autoCommit?: boolean;
}
```

## Prerequisites

- Kafka cluster running (default: localhost:9092)
- Node.js and npm installed
- TypeScript configured

## Troubleshooting

1. **Connection Issues**: Ensure Kafka is running and accessible at the configured broker addresses
2. **Topic Not Found**: Topics are auto-created by default, but you can create them explicitly
3. **Consumer Group Issues**: Use unique group IDs for different test scenarios
4. **Timeout Issues**: Increase timeout values for slow networks or heavy loads

## Examples

See `src/tests/integration/kafka.test.ts` for comprehensive examples including:
- Basic message publishing and consumption
- JSON message handling
- Multiple topic publishing
- Error handling scenarios
- Integration patterns
- Topic management operations