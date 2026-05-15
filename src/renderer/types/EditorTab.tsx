import type { editor as mEditor } from "modern-monaco/types/monaco";

export type EditorTab = {
    id: number,
    filename: string,
    filePath: string
    isModified: boolean,
}

function getFileName(filePath: string) {
    return filePath.split('/').pop()?.split('.').shift() || '';
}