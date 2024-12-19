'use client';

import axios from 'axios';
import { FadrError } from './error-handler';
import type { Asset } from './types';

const FADR_API_URL = 'https://api.fadr.com';

interface Task {
  _id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  asset: Asset;
}

interface CreateTaskResponse {
  task: Task;
}

export async function createStemTask(assetId: string): Promise<Task> {
  try {
    const response = await axios.post<CreateTaskResponse>(
      `${FADR_API_URL}/assets/analyze/stem`,
      { _id: assetId },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FADR_API_KEY}`,
        },
      }
    );
    return response.data.task;
  } catch (error) {
    throw new FadrError('Failed to create stem task', 'TASK_CREATION_ERROR');
  }
}

export async function pollTaskStatus(taskId: string): Promise<Task> {
  try {
    const response = await axios.post<{ tasks: Task[] }>(
      `${FADR_API_URL}/tasks/query`,
      { _ids: [taskId] },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FADR_API_KEY}`,
        },
      }
    );
    return response.data.tasks[0];
  } catch (error) {
    throw new FadrError('Failed to get task status', 'TASK_STATUS_ERROR');
  }
}