import logger from './Logger';

export interface Cleanupable {
  cleanup(): Promise<void> | void;
}

export class ResourceManager {
  private static instance: ResourceManager;
  private resources: Set<Cleanupable> = new Set();
  private isShuttingDown = false;

  private constructor() {
    this.setupGracefulShutdown();
  }

  public static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  public register(resource: Cleanupable): void {
    if (this.isShuttingDown) {
      logger.warn('Cannot register resource during shutdown');
      return;
    }
    this.resources.add(resource);
    logger.debug({ resourceCount: this.resources.size }, 'Resource registered');
  }

  public unregister(resource: Cleanupable): void {
    const removed = this.resources.delete(resource);
    if (removed) {
      logger.debug({ resourceCount: this.resources.size }, 'Resource unregistered');
    }
  }

  public async cleanup(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    logger.info({ resourceCount: this.resources.size }, 'Starting resource cleanup');

    const cleanupPromises = Array.from(this.resources).map(async (resource) => {
      try {
        await resource.cleanup();
      } catch (error) {
        logger.error({ error }, 'Error during resource cleanup');
      }
    });

    await Promise.allSettled(cleanupPromises);
    this.resources.clear();
    logger.info('Resource cleanup completed');
  }

  private setupGracefulShutdown(): void {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info({ signal }, 'Received shutdown signal');
        await this.cleanup();
        process.exit(0);
      });
    });

    process.on('beforeExit', async () => {
      await this.cleanup();
    });
  }
}