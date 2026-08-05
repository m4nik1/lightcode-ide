import { DatabaseSync } from 'node:sqlite'
import os from 'node:os'
import path from 'node:path'

// TODO: create a handling function create the .lightcode directory
const database = new DatabaseSync(path.join(os.homedir(), '.lightcode') + '/state.db')

const initDatabase = `
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        project_name TEXT NOT NULL,
        path TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS threads (
        id TEXT PRIMARY KEY,
        project_id STRING,
        external_thread_id STRING,
        name TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        thread_id TEXT NOT NULL,
        text TEXT NOT NULL,
        model TEXT NOT NULL,
        thinking_level TEXT,
        role TEXT,
        SEQ INTEGER NOT NULL
    );
`

database.exec(initDatabase);

export default database;
