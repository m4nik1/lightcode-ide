import { init } from "modern-monaco";
import type { editor as mEditor } from "modern-monaco/types/monaco";

export class m4Editor {
    // Instantiate any class variables here
    private editorRef: React.RefObject<HTMLDivElement>;
    private editor: mEditor.IStandaloneCodeEditor | null;
    private model: mEditor.ITextModel | null;
    public activeTabId: string | null;
    private monaco; 
    private models: mEditor.ITextModel[];

    constructor(ref : React.RefObject<HTMLDivElement> | null) {
        this.editorRef = ref
        this.editor = null;
        this.model = null;
        this.monaco = null;
        this.models = [];
    }

    async createEditor(filePath : string) {
        this.monaco = await init();
        
        console.log("Setting up editor...")

        if(this.editor == null) {
            console.log("Editor does not exist, creating new one...");
            this.editor = this.monaco.editor.create(this.editorRef.current!, {
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                cursorBlinking: "smooth"
            });

            if(filePath != '') {
                const fileContents = await window.electronAPI.readFile(filePath)
                this.model = this.monaco.editor.createModel(fileContents, undefined, this.monaco.Uri.file(filePath));
            }
            else {
                this.model = this.monaco.editor.createModel('')
            }

            this.editor.setModel(this.model)
        } else {
            this.createModel(filePath);
        }

    }

    async createModel(filePath : string) {
        const findModel = this.models.find(model => model.uri.fsPath === filePath)
        if(findModel) {
            this.editor.setModel(findModel)
        }
        else {
            const fileContents = await window.electronAPI.readFile(filePath);
            const newModel = this.monaco.editor.createModel(fileContents, undefined, this.monaco.Uri.file(filePath))
            this.models.push(newModel);
            this.editor.setModel(newModel);
        }
    }

    getEditor() {
        return this.editor;
    }

    setRef(ref: React.RefObject<HTMLDivElement>) {
        this.editorRef = ref;
    }

    getModel() {
        return this.model
    }
}