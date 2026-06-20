import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { KafkaTestHelper, ConsumedMessage } from '../../helpers/KafkaTestHelper';
import logger from '../../utils/Logger';

describe('Kafka Message Testing', () => {
  let kafkaHelper: KafkaTestHelper;
  const testTopic = 'test-topic-' + Date.now();
  const testGroupId = 'test-group-' + Date.now();

  before(async function() {
    this.timeout(30000);
    
    kafkaHelper = new KafkaTestHelper({
      brokers: ['localhost:9092'],
      clientId: 'api-test-framework',
      timeout: 10000,
      retry: {
        attempts: 3,
        delayMs: 1000
      }
    });

    try {
      await kafkaHelper.connect();
      await kafkaHelper.createTopic(testTopic, 1, 1);
    } catch (error) {
      logger.warn({ error }, 'Kafka setup failed - tests may be skipped');
      this.skip();
    }
  });

  after(async function() {
    this.timeout(30000);
    
    if (kafkaHelper) {
      try {
        await kafkaHelper.deleteTopic(testTopic);
        await kafkaHelper.disconnect();
      } catch (error) {
        logger.warn({ error }, 'Kafka cleanup failed');
      }
    }
  });

  describe('Message Publishing', () => {
    it('should publish a simple string message', async function() {
      this.timeout(10000);
      
      const message = 'Hello Kafka World!';
      
      await kafkaHelper.publishMessage({
        topic: testTopic,
        messages: [{
          key: 'test-key',
          value: message,
          headers: {
            'content-type': 'text/plain',
            'test-id': '001'
          }
        }]
      });
    });

    it('should publish a JSON message', async function() {
      this.timeout(10000);
      
      const message = {
        id: 123,
        name: 'Test User',
        email: 'test@example.com',
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'api-test',
          version: '1.0'
        }
      };
      
      await kafkaHelper.publishMessage({
        topic: testTopic,
        messages: [{
          key: 'user-123',
          value: message,
          headers: {
            'content-type': 'application/json'
          }
        }]
      });
    });

    it('should publish multiple messages at once', async function() {
      this.timeout(10000);
      
      const messages = [
        { key: 'msg-1', value: 'First message' },
        { key: 'msg-2', value: 'Second message' },
        { key: 'msg-3', value: { id: 3, text: 'Third message as JSON' } }
      ];
      
      await kafkaHelper.publishMessage({
        topic: testTopic,
        messages
      });
    });

    it('should publish to multiple topics', async function() {
      this.timeout(15000);
      
      const additionalTopic = testTopic + '-multi';
      await kafkaHelper.createTopic(additionalTopic);
      
      const message = {
        broadcast: true,
        content: 'This message goes to multiple topics',
        timestamp: Date.now()
      };
      
      await kafkaHelper.publishMessages([testTopic, additionalTopic], message);
      
      await kafkaHelper.deleteTopic(additionalTopic);
    });
  });

  describe('Message Consumption', () => {
    it('should consume messages from a topic', async function() {
      this.timeout(15000);
      
      const testMessage = {
        test: 'consume-test',
        data: 'sample data for consumption',
        timestamp: Date.now()
      };
      
      await kafkaHelper.publishMessage({
        topic: testTopic,
        messages: [{
          key: 'consume-key',
          value: testMessage
        }]
      });
      
      const messages = await kafkaHelper.consumeMessages({
        topic: testTopic,
        groupId: testGroupId,
        timeout: 10000,
        maxMessages: 5,
        fromBeginning: true
      });
      
      expect(messages).to.be.an('array');
      expect(messages.length).to.be.greaterThan(0);
      
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage).to.have.property('topic', testTopic);
      expect(lastMessage).to.have.property('key');
      expect(lastMessage).to.have.property('value');
      expect(lastMessage).to.have.property('offset');
      expect(lastMessage).to.have.property('timestamp');
      
      const parsedMessage = kafkaHelper.parseMessage(lastMessage);
      expect(parsedMessage).to.have.property('test', 'consume-test');
    });

    it('should wait for a specific message', async function() {
      this.timeout(20000);
      
      const uniqueId = 'wait-test-' + Date.now();
      const testMessage = {
        id: uniqueId,
        action: 'wait-for-me',
        data: 'This message should be found by the predicate'
      };
      
      setTimeout(async () => {
        await kafkaHelper.publishMessage({
          topic: testTopic,
          messages: [{
            key: uniqueId,
            value: testMessage
          }]
        });
      }, 2000);
      
      const foundMessage = await kafkaHelper.waitForMessage(
        testTopic,
        testGroupId + '-wait',
        (message: ConsumedMessage) => {
          const parsed = kafkaHelper.parseMessage(message);
          return parsed && parsed.id === uniqueId;
        },
        15000
      );
      
      expect(foundMessage).to.not.be.null;
      const parsedMessage = kafkaHelper.parseMessage(foundMessage!);
      expect(parsedMessage).to.have.property('action', 'wait-for-me');
    });

    it('should parse different message formats', async function() {
      this.timeout(15000);
      
      const messages = [
        { key: 'string', value: 'plain string message' },
        { key: 'json', value: { type: 'json', data: [1, 2, 3] } },
        { key: 'number', value: '12345' }
      ];
      
      for (const msg of messages) {
        await kafkaHelper.publishMessage({
          topic: testTopic,
          messages: [msg]
        });
      }
      
      const consumedMessages = await kafkaHelper.consumeMessages({
        topic: testTopic,
        groupId: testGroupId + '-parse',
        timeout: 10000,
        maxMessages: 3,
        fromBeginning: true
      });
      
      expect(consumedMessages.length).to.be.greaterThan(0);
      
      for (const message of consumedMessages.slice(-3)) {
        const parsed = kafkaHelper.parseMessage(message);
        
        if (message.key?.toString() === 'string') {
          expect(parsed).to.equal('plain string message');
        } else if (message.key?.toString() === 'json') {
          expect(parsed).to.be.an('object');
          expect(parsed).to.have.property('type', 'json');
        } else if (message.key?.toString() === 'number') {
          expect(parsed).to.equal('12345');
        }
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle publishing to non-existent topic', async function() {
      this.timeout(10000);
      
      const nonExistentTopic = 'non-existent-topic-' + Date.now();
      
      try {
        await kafkaHelper.publishMessage({
          topic: nonExistentTopic,
          messages: [{
            value: 'This should create the topic automatically'
          }]
        });
      } catch (error) {
        expect(error).to.be.an('error');
      }
    });

    it('should handle empty message consumption gracefully', async function() {
      this.timeout(10000);
      
      const emptyTopic = 'empty-topic-' + Date.now();
      await kafkaHelper.createTopic(emptyTopic);
      
      const messages = await kafkaHelper.consumeMessages({
        topic: emptyTopic,
        groupId: testGroupId + '-empty',
        timeout: 3000,
        maxMessages: 1
      });
      
      expect(messages).to.be.an('array');
      expect(messages).to.be.empty;
      
      await kafkaHelper.deleteTopic(emptyTopic);
    });

    it('should handle message with null or undefined values', async function() {
      this.timeout(10000);
      
      await kafkaHelper.publishMessage({
        topic: testTopic,
        messages: [{
          key: 'null-test',
          value: ''
        }]
      });
      
      const messages = await kafkaHelper.consumeMessages({
        topic: testTopic,
        groupId: testGroupId + '-null',
        timeout: 5000,
        maxMessages: 1,
        fromBeginning: false
      });
      
      if (messages.length > 0) {
        const parsed = kafkaHelper.parseMessage(messages[0]);
        expect(parsed).to.equal('');
      }
    });
  });

  describe('Topic Management', () => {
    it('should list existing topics', async function() {
      this.timeout(10000);
      
      const topics = await kafkaHelper.listTopics();
      
      expect(topics).to.be.an('array');
      expect(topics).to.include(testTopic);
    });

    it('should create and delete topics', async function() {
      this.timeout(15000);
      
      const tempTopic = 'temp-topic-' + Date.now();
      
      await kafkaHelper.createTopic(tempTopic, 2, 1);
      
      const topicsAfterCreate = await kafkaHelper.listTopics();
      expect(topicsAfterCreate).to.include(tempTopic);
      
      await kafkaHelper.deleteTopic(tempTopic);
      
      const topicsAfterDelete = await kafkaHelper.listTopics();
      expect(topicsAfterDelete).to.not.include(tempTopic);
    });
  });

  describe('Integration Scenarios', () => {
    it('should simulate request-response pattern', async function() {
      this.timeout(20000);
      
      const requestTopic = testTopic + '-request';
      const responseTopic = testTopic + '-response';
      
      await kafkaHelper.createTopic(requestTopic);
      await kafkaHelper.createTopic(responseTopic);
      
      const correlationId = 'req-' + Date.now();
      const requestMessage = {
        correlationId,
        action: 'getUserData',
        userId: 123,
        timestamp: new Date().toISOString()
      };
      
      setTimeout(async () => {
        const responseMessage = {
          correlationId,
          status: 'success',
          data: { id: 123, name: 'Test User' },
          timestamp: new Date().toISOString()
        };
        
        await kafkaHelper.publishMessage({
          topic: responseTopic,
          messages: [{
            key: correlationId,
            value: responseMessage
          }]
        });
      }, 2000);
      
      await kafkaHelper.publishMessage({
        topic: requestTopic,
        messages: [{
          key: correlationId,
          value: requestMessage
        }]
      });
      
      const response = await kafkaHelper.waitForMessage(
        responseTopic,
        testGroupId + '-response',
        (message: ConsumedMessage) => {
          const parsed = kafkaHelper.parseMessage(message);
          return parsed && parsed.correlationId === correlationId;
        },
        15000
      );
      
      expect(response).to.not.be.null;
      const parsedResponse = kafkaHelper.parseMessage(response!);
      expect(parsedResponse).to.have.property('status', 'success');
      expect(parsedResponse).to.have.property('data');
      expect(parsedResponse.data).to.have.property('name', 'Test User');
      
      await kafkaHelper.deleteTopic(requestTopic);
      await kafkaHelper.deleteTopic(responseTopic);
    });
  });
});