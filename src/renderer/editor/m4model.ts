import type { editor as mEditor } from "modern-monaco/types/monaco";

export class m4model {
    private model: mEditor.ITextModel
    constructor() {
        this.model = null;
    }

    createModel(editor, fileContents='') {
        return 
    }

    getModel() {
        return this.model
    }
}