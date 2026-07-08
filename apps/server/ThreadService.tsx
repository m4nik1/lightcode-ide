import lightThread from "./lightThread";

export class ThreadService {
  recentThreads: lightThread[];
  constructor() {
    this.recentThreads = [];
  }

  getRecentThreads() {
    return this.recentThreads;
  }
}
