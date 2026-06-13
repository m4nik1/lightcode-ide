import type { editor as mEditor } from "modern-monaco/types/monaco";
import { init } from "modern-monaco";

type MonacoApi = Awaited<ReturnType<typeof init>>;

export class m4model {
    private model: mEditor.ITextModel | null;

    constructor() {
        this.model = null;
    }

    async createModel(monacoInstance : MonacoApi, filePath: string) : Promise<mEditor.ITextModel> {
        // TODO: deal with opening file via ipc call
        const fileContents = filePath == '' ? '' : await window.electronAPI.readFile(filePath);

        this.model = monacoInstance.editor.createModel(fileContents, undefined, monacoInstance.Uri.file(filePath));

        return this.model;
    }

    getModel() {
        return this.model
    }
}
