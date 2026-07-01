import { DatabaseSync } from 'node:sqlite'
import os from 'node:os'
import path from 'node:path'

// TODO: create a handling function create the .lightcode directory
const database = new DatabaseSync(path.join(os.homedir(), '.lightcode')+'/state.db')

const initDatabase = `
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        project_name TEXT NOT NULL,
        path TEXT NOT NULL
    )
`

database.exec(initDatabase);

export default database;