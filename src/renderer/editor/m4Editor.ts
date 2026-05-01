import { init } from "modern-monaco";
import type { editor as mEditor } from "modern-monaco/types/monaco";

export class m4Editor {
    // Instantiate any class variables here
    private editorRef: React.RefObject<HTMLDivElement>;
    private editor: mEditor.IStandaloneCodeEditor | null;
    private model: mEditor.ITextModel | null;
    public activeTabId: string | null;
    private monaco; 
    private models: Map<string, mEditor.ITextModel>;

    constructor(ref : React.RefObject<HTMLDivElement> | null) {
        this.editorRef = ref
        this.editor = null;
        this.model = null;
        this.monaco = null;
        this.models = new Map<string, mEditor.ITextModel>();
    }

    async createEditor(filePath : string) {
        this.monaco = await init();

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
                this.models.set(filePath, this.model);
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
        console.log("models: ", this.models);
        if(this.models.has(filePath)) {
            this.editor.setModel(this.models.get(filePath))
        }
        else {
            const fileContents = await window.electronAPI.readFile(filePath);
            const newModel: mEditor.ITextModel = this.monaco.editor.createModel(fileContents, undefined, this.monaco.Uri.file(filePath))
            this.models.set(filePath, newModel);
            this.editor.setModel(newModel);
            console.log("created model...: ", newModel);
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