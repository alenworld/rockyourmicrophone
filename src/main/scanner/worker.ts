/* eslint-disable no-restricted-syntax */
import { parentPort } from 'worker_threads';
import fs from 'fs';
import path from 'path';

const TARGET = new Set(['.xlsx', '.csv', '.txt']);

parentPort?.postMessage({ type: 'ready' });

async function scan(dir: string) {
  let entries;

  try {
    entries = await fs.promises.readdir(dir, {
      withFileTypes: true,
    });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    try {
      if (entry.isDirectory()) {
        parentPort?.postMessage({
          type: 'dir',
          dir: fullPath,
        });
      } else {
        const ext = path.extname(entry.name).toLowerCase();

        if (TARGET.has(ext)) {
          parentPort?.postMessage({
            type: 'file',
            file: fullPath,
          });
        }
      }
    } catch {
      /* empty */
    }
  }

  parentPort?.postMessage({ type: 'done' });
}

parentPort?.on('message', async (msg) => {
  if (msg.type === 'scan') {
    await scan(msg.dir);
  }
});
