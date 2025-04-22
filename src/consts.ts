import path from 'path';
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config({
  path: path.resolve(process.cwd()),
});

export const TEMPORAL_SERVER_ADDRESS = process.env.TEMPORAL_SERVER_ADDRESS;

export const TASK_QUEUE_NAME = 'mewa-tasks';
