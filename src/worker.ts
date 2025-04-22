import { NativeConnection, Worker } from '@temporalio/worker';
import { TASK_QUEUE_NAME, TEMPORAL_SERVER_ADDRESS } from './consts';

import * as activities from './activities';

async function run() {
  const connection = await NativeConnection.connect({
    address: TEMPORAL_SERVER_ADDRESS,
  });

  const worker = await Worker.create({
    connection,
    //namespace:  for temporal cloud
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: TASK_QUEUE_NAME,
  });

  await worker.run();
  await connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
