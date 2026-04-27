export type EditorTab = {
    id: string;
    label: string;
    isModified: boolean;
}

function getFileName(filePath: string) {
    return filePath.split('/').pop()?.split('.').shift() || '';
}