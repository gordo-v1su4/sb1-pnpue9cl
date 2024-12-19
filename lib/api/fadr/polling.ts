import { Task } from './types';
import { FadrError } from './error-handler';
import { POLLING_INTERVAL, POLLING_TIMEOUT } from './config';
import { pollTaskStatus } from './task';

export async function pollForTaskCompletion(
  taskId: string,
  onProgress?: (progress: number) => void
): Promise<Task> {
  const startTime = Date.now();

  while (true) {
    if (Date.now() - startTime > POLLING_TIMEOUT) {
      throw new FadrError(
        'Task processing timed out',
        'POLLING_TIMEOUT'
      );
    }

    const task = await pollTaskStatus(taskId);

    if (onProgress && task.status.progress) {
      onProgress(task.status.progress);
    }

    if (task.status.complete) {
      return task;
    }

    if (task.status.msg.toLowerCase().includes('failed')) {
      throw new FadrError(
        `Task failed: ${task.status.msg}`,
        'TASK_STATUS_ERROR'
      );
    }

    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
  }
}