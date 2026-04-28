export type EditorTab = {
    id: string;
    name: string;
    isModified: boolean;
    filePath: string;
}

function getFileName(filePath: string) {
    return filePath.split('/').pop()?.split('.').shift() || '';
}