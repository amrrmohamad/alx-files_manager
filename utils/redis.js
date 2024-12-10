import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.client = createClient();

        this.client.on('error', (err) => {
            console.error(`Redis client not connected to the server: ${err.message}`);
        });

        this.client.on('connect', () => {
            console.log('Redis client connected to the server');
        });
    }

    isAlive() {
        return this.client.connected;
    }
	/**
	 * Function - get: take relove and reject
	 * 
	 * Return : promise.
	 */
    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }
	/**
         * Function - set: take key, value, duration
         *
         * Return : promise.
         */

    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, duration, value, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
	 /**
         * Function - del: take key.
         *
         * Return : promise.
         */

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

const redisClient = new RedisClient();
export default redisClient;
