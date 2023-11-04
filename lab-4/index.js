import redis from 'redis';
import axios from 'axios';
import { writeFileSync, readFileSync } from 'fs';
import { readJSON } from './utils.js';

const config = JSON.parse(readFileSync('./config.json', 'utf8'));

const redisClient = redis.createClient();
redisClient.on('connect', () => {
  console.log('Redis is connected.');
});
await redisClient.connect();

const axiosClient = axios.create();

const getAndSaveData = async () => {
  const result = (await axiosClient.get(config.url)).data;
  return result;
};

await getAndSaveData().then((result) => {
  const json = JSON.stringify(result);
  writeFileSync('data.json', json, (error) => {
    if (error) {
      console.error(error);
    }
  });
  console.log(' --------------------');
  console.log('| JSON file created! |');
  console.log(' --------------------');
});

class ConsoleStrategy {
  action() {
    const result = readJSON();

    console.log(Object.keys(result[0]).join('\t'));
    result.forEach((element) => {
      console.log(Object.values(element).join('\t'));
    });
  }
}

class RedisStrategy {
  action() {
    const result = readJSON();
    const replies = [];
    result.forEach((obj, index) => {
      redisClient
        .set(`${index}`, JSON.stringify(obj))
        .then((doc) => {
          return doc;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    console.log('Data saved to Redis');
  }
}

class StrategyManager {
  strategy;
  constructor() {
    this.strategy = null;
  }

  set strategy(strategy) {
    this.strategy = strategy;
  }

  get strategy() {
    return this.strategy;
  }

  action() {
    this.strategy.action();
  }
}

const manager = new StrategyManager();
const consoleStrategy = new ConsoleStrategy();
const redisStrategy = new RedisStrategy();

if (config.strategy === 'console') {
  manager.strategy = consoleStrategy;
}

if (config.strategy === 'redis') {
  manager.strategy = redisStrategy;
}

manager.action();
