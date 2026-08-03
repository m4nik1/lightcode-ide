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

export type MessageRecord = {
  id: string;
  thread_id: string;
  text: string;
  model: string;
  thinking_level: string | null;
  role: string | null;
  SEQ: number;
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
`);

const getThreads = database.prepare(
  `SELECT *
   FROM threads
   WHERE project_id = ?
   ORDER BY created_at DESC, rowid DESC`,
);

const getThreadByIDStatement = database.prepare(
  `SELECT *
   FROM threads
   WHERE id = ?`,
);

const renameThread = database.prepare(
  `UPDATE threads SET name = ? WHERE id = ? RETURNING id, name`,
);

const updateThreadExternalID = database.prepare(`
  UPDATE threads
  SET external_thread_id = ?
  WHERE id = ?
  RETURNING id, external_thread_id
`);



const getMessagesFromThread = database.prepare(`
  SELECT *
  FROM messages
  WHERE thread_id = ?
  ORDER BY SEQ ASC, rowid ASC
`);

const getNextMessageSequence = database.prepare(`
  SELECT COALESCE(MAX(SEQ), 0) + 1 AS sequence
  FROM messages
  WHERE thread_id = ?
`);

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

const storeMessage = database.prepare(`
  INSERT INTO messages (id, thread_id, text, model, thinking_level, role, SEQ)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  RETURNING text, model, thinking_level
`);

export function createProject(input: {
  id: string;
  name: string;
  path: string;
}) {
  return createProjectStatement.get(
    input.id,
    input.name,
    input.path,
  ) as ProjectRecord;
}

export function getProjectByThreadID(threadID: string) {
  return getProjectByThreadIDStatement.get(threadID) as
    | ProjectRecord
    | undefined;
}

export function getThreadByID(threadID: string) {
  return getThreadByIDStatement.get(threadID) as ThreadRecord | undefined;
}

export function loadMessagesFromThread(threadID: string) {
  return getMessagesFromThread.all(threadID) as MessageRecord[];
}

export function nextMessageSequence(threadID: string) {
  const result = getNextMessageSequence.get(threadID) as {
    sequence: number;
  };

  return result.sequence;
}

export {
  getProjectsID,
  getProjects,
  createThread,
  getThreads,
  storeMessage,
  renameThread,
  updateThreadExternalID
}
