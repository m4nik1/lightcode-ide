import crypto from 'node:crypto'
import { ThreadManager } from './threadManager.ts';
import { Codex } from '@openai/codex-sdk';
import { createProject, getProjects } from './lightQueries.ts';

type project = {
    id: string;
    name: string;
    path: string;
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
        this.threadManager = new ThreadManager(codex)
        const id = crypto.randomUUID();

        const newProject : project = {
            id,
            name,
            path,
        }

        this.projects.push(newProject);

        createProject.get(id, name, path)
    }

    getProjects() {
        return getProjects.all();
    }

    getThreadManager() {
        return this.threadManager;
    }
}

export default lightProject;
