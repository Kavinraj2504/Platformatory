import { Worker } from '@temporalio/worker';
import * as activities from '../activities/profile.activities';
import path from 'path';

export async function runProfileWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('../workflows/index'),
    activities,
    taskQueue: 'profile-update',
  });
  await worker.run();
}
