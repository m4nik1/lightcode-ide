import type { editor as mEditor } from "modern-monaco/types/monaco";
import { init } from "modern-monaco";

type MonacoApi = Awaited<ReturnType<typeof init>>;

export class m4model {
    private model: mEditor.ITextModel
    constructor() {
        this.model = null;
    }

    createModel(monacoInstance : MonacoApi, filePath: string, fileContents='') {
        this.model = monacoInstance.editor.createModel(fileContents, undefined, monacoInstance.Uri.file(filePath));
    }

    getModel() {
        return this.model
    }
}
