import { init } from "modern-monaco";
import type { editor as mEditor } from "modern-monaco/types/monaco";

export class m4Editor {
    // Instantiate any class variables here
    private editorRef: HTMLDivElement | null;
    private editor: mEditor.IStandaloneCodeEditor | null;
    private model: mEditor.ITextModel | null;

    constructor(ref : HTMLDivElement | null) {
        this.editorRef  = ref
        this.editor = null;
        this.model = null;
    }

    async createEditor(filePath : string) {
        const monaco = await init();
        
        console.log("Setting up editor...")

        this.editor = monaco.editor.create(this.editorRef!, {
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            cursorBlinking: "smooth"
        });

        if(filePath != '') {
            const fileContents = await window.electronAPI.readFile(filePath)
            this.model = monaco.editor.createModel(fileContents, undefined, monaco.Uri.file(filePath));
        }
        else {
            this.model = monaco.editor.createModel('')
        }

        this.editor.setModel(this.model)
    }
}