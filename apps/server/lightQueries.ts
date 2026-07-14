import database from "./lightDB.ts";

export type ProjectRecord = {
  id: string;
  name: string;
  path: string;
};

export type ThreadRecord = {
  id: string;
  project_id: string;
  name: string;
  created_at: number;
  updated_at: number;
};

const createProjectStatement = database.prepare(`
    INSERT INTO projects (id, project_name, path)
    VALUES (?, ?, ?)
    RETURNING id, project_name as name, path
`);

const createThread = database.prepare(`
  INSERT INTO threads (id, project_id, name, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?)
  RETURNING id, name
`)

const getThreads = database.prepare(
  `SELECT * FROM threads WHERE project_id = ?`
)

const getProjects = database.prepare(`
    SELECT id, project_name as name, path
    FROM projects
`)

const getProjectsID = database.prepare(`
    SELECT * FROM projects WHERE id = ?
`)

const getProjectByThreadIDStatement = database.prepare(`
    SELECT projects.id, projects.project_name as name, projects.path
    FROM threads
    INNER JOIN projects ON projects.id = threads.project_id
    WHERE threads.id = ?
`);

export function createProject(input: {
  id: string;
  name: string;
  path: string;
}) {
  return createProjectStatement.get(input.id, input.name, input.path) as ProjectRecord;
}

export function getProjectByThreadID(threadID: string) {
  return getProjectByThreadIDStatement.get(threadID) as
    | ProjectRecord
    | undefined;
}

export {
  getProjectsID,
  getProjects,
  createThread,
  getThreads
}
