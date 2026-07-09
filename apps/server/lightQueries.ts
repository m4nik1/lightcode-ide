import database from "./lightDB.ts";

const createProjectStatement = database.prepare(`
    INSERT INTO projects (id, project_name, path)
    VALUES (?, ?, ?)
    RETURNING id, project_name as name, path
`);

const getProjects = database.prepare(`
    SELECT id, project_name as name, path
    FROM projects
`)

const getProjectsID = database.prepare(`
    SELECT * FROM projects WHERE id = ?
`)

export function createProject(input: {
    id: string;
    name: string;
    path: string;
}) {
    return createProjectStatement.get(input.id, input.name, input.path);
}

export {
    getProjectsID,
    getProjects
}
