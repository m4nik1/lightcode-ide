import type { editor as mEditor } from "modern-monaco/types/monaco";

export type EditorTab = {
    id: string;
    name: string;
    isModified: boolean;
    filePath: string;
    model: mEditor.ITextModel
}

function getFileName(filePath: string) {
    return filePath.split('/').pop()?.split('.').shift() || '';
}