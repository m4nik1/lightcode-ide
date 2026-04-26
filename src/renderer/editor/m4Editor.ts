import { init } from "modern-monaco";
import type { editor as mEditor } from "modern-monaco/types/monaco";

export class m4Editor {
    // Instantiate any class variables here
    private editorRef: HTMLDivElement | null;
    private editor: mEditor.IStandaloneCodeEditor | null;
    private model: mEditor.ITextModel | null;
    private monaco;

    constructor(ref : HTMLDivElement | null) {
        this.editorRef  = ref
        this.editor = null;
        this.model = null;
        this.monaco = null;
    }

    async createEditor(filePath : string) {
        this.monaco = await init();
        
        console.log("Setting up editor...")

        this.editor = this.monaco.editor.create(this.editorRef!, {
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            cursorBlinking: "smooth"
        });

        if(filePath != '') {
            const fileContents = await window.electronAPI.readFile(filePath)
            this.model = this.monaco.editor.createModel(fileContents, undefined, monaco.Uri.file(filePath));
        }
        else {
            this.model = this.monaco.editor.createModel('')
        }

        this.editor.setModel(this.model)
    }

    async createModel(filePath : string) {
        const fileContents = await window.electronAPI.readFile(filePath);
        const newModel = this.monaco.editor.createModel(fileContents, undefined, this.monaco.Uri.file(filePath))
    
        this.editor?.setModel(newModel);
    }

    getEditor() {
        return this.editor;
    }

    getModel() {
        return this.model
    }
}