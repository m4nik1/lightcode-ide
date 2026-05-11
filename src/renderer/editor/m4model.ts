import type { editor as mEditor } from "modern-monaco/types/monaco";
import { init } from "modern-monaco";

type MonacoApi = Awaited<ReturnType<typeof init>>;

export class m4model {
    private model: mEditor.ITextModel | null;

    constructor() {
        this.model = null;
    }

    createModel(monacoInstance : MonacoApi, filePath: string) : mEditor.ITextModel {
        // TODO: deal with opening file via ipc call
        const fileContents = '';

        this.model = monacoInstance.editor.createModel(fileContents, undefined, monacoInstance.Uri.file(filePath));

        return this.model;
    }

    getModel() {
        return this.model
    }
}
