/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import { Worker } from 'worker_threads';
import path from 'path';
import { BrowserWindow } from 'electron';

export class ThreadPool {
  private queue: string[] = [];

  private workers: Worker[] = [];

  private active = 0;

  constructor(
    private size: number,
    private win: BrowserWindow,
  ) {
    for (let i = 0; i < size; i++) {
      this.createWorker();
    }
  }

  private createWorker() {
    const worker = new Worker(path.join(__dirname, 'worker.js'));

    worker.on('message', (msg) => {
      if (msg.type === 'file') {
        this.win.webContents.send('scanner:file', msg.file);
      }

      if (msg.type === 'dir') {
        this.addTask(msg.dir);
      }

      if (msg.type === 'done') {
        this.active--;
        this.dispatch(worker);
      }
    });

    this.workers.push(worker);
  }

  addTask(dir: string) {
    this.queue.push(dir);
    this.dispatchAll();
  }

  private dispatchAll() {
    this.workers.forEach((w) => this.dispatch(w));
  }

  private dispatch(worker: Worker) {
    if (this.queue.length === 0) return;
    if (this.active >= this.size) return;

    const dir = this.queue.shift();
    if (!dir) return;

    this.active++;

    worker.postMessage({
      type: 'scan',
      dir,
    });
  }
}
