import crypto from 'node:crypto'
import { ThreadManager } from './threadManager.ts';
import { Codex } from '@openai/codex-sdk';

type project = {
    id: string;
    name: string;
    path: string;
    threadManager: ThreadManager
}

class lightProject {
    projects : project[]
    threadManager : ThreadManager | null;
    constructor() {
        this.projects = [];
        this.threadManager = null;
    }

    createProject(name : string, path : string) {
        const codex = new Codex()
        const threadManager = new ThreadManager(codex)

        const newProject : project = {
            id: crypto.randomUUID(),
            name,
            path,
            threadManager
        }

        this.projects.push(newProject);
    }

    getProjects() : project[] {
        return this.projects;
    }

    getThreadManager() {
        return this.threadManager;
    }
}

export default lightProject;