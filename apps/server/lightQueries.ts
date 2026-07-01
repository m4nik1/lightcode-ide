import database from "./lightDB.ts";

const createProject = database.prepare(`
    INSERT INTO projects (id, project_name, path)
    VALUES (?, ?, ?)
    RETURNING id, project_name, path
`);

const getProjects = database.prepare(`
    SELECT * from projects
`)

export {
    createProject,
    getProjects
}