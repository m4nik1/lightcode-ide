import type { RefObject } from "react";
import { init } from "modern-monaco";
import type { editor as mEditor } from "modern-monaco/types/monaco";
import { m4model } from "./m4model";

type MonacoApi = Awaited<ReturnType<typeof init>>;

export class m4Editor {
    private editorRef: RefObject<HTMLDivElement | null>;
    private editor: mEditor.IStandaloneCodeEditor | null;
    public activeTabId: string | null = null;
    private monaco: MonacoApi | null;
    private models: Array<mEditor.ITextModel | []>;
    private currentModel: mEditor.ITextModel | null;
    /** Last saved Monaco alternative version id per file path (disk-backed tabs). */
    private savedVersionByPath: Map<string, number>;
    private dirtyListeners = new Set<() => void>();
    private contentListenerAttached = false;

    constructor(ref: RefObject<HTMLDivElement | null> | null) {
        this.editorRef = ref ?? { current: null };
        this.editor = null;
        this.monaco = null;
        this.models = [] 
        this.savedVersionByPath = new Map();
        this.currentModel = null;
    }

    // private registerSaveKeybinding() {
    //     if (this.editor == null || this.monaco == null) {
    //         return;
    //     }
    //     const { KeyMod, KeyCode } = this.monaco;
    //     this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
    //         void this.save();
    //     });
    // }

    // private attachModelChangeListener() {
    //     if (this.editor == null || this.contentListenerAttached) {
    //         return;
    //     }
    //     this.contentListenerAttached = true;
    //     this.editor.onDidChangeModelContent(() => {
    //         this.notifyDirty();
    //     });
    // }

    // private notifyDirty() {
    //     this.dirtyListeners.forEach((listener) => {
    //         listener();
    //     });
    // }

    // /** Subscribe to edits / saves that affect dirty state; used to refresh tab indicators. */
    // subscribeDirty(listener: () => void): () => void {
    //     this.dirtyListeners.add(listener);
    //     return () => {
    //         this.dirtyListeners.delete(listener);
    //     };
    // }

    // private setActiveModel(next: mEditor.ITextModel, diskPath?: string) {
    //     this.model = next;
    //     if (diskPath != null && diskPath !== "" && !this.savedVersionByPath.has(diskPath)) {
    //         this.savedVersionByPath.set(diskPath, next.getAlternativeVersionId());
    //     }
    // }

    async createEditor(filePath: string) {
        this.monaco = await init();

        if (this.editor == null) {
            console.log("Editor does not exist, creating new one...");
            const container = this.editorRef.current;
            if (container == null) {
                console.warn("createEditor: editor container ref is not mounted");
                return;
            }
            this.editor = this.monaco.editor.create(container, {
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                cursorBlinking: "smooth",
            });

            this.currentModel = await new m4model().createModel(this.monaco, filePath);
            this.models.push(this.currentModel)
            this.editor.setModel(this.currentModel);
        } else {
            this.currentModel = await new m4model().createModel(this.monaco, filePath); 
            this.editor.setModel(this.currentModel);
            this.models.push(this.currentModel)
        }
    }

    getModels() {
        return this.models
    }

    //         this.registerSaveKeybinding();
    //         this.attachModelChangeListener();
    //         this.notifyDirty();

    // async createModel(filePath: string) {
    //     console.log("models: ", this.models);
    //     const ed = this.editor;
    //     const monaco = this.monaco;
    //     if (ed == null || monaco == null) {
    //         return;
    //     }
    //     if (this.models.has(filePath)) {
    //         const existing = this.models.get(filePath);
    //         if (existing == null) {
    //             return;
    //         }
    //         ed.setModel(existing);
    //         this.model = existing;
    //     } else {
    //         const fileContents = await window.electronAPI.readFile(filePath);
    //         const newModel: mEditor.ITextModel = monaco.editor.createModel(
    //             fileContents,
    //             undefined,
    //             monaco.Uri.file(filePath),
    //         );
    //         this.models.set(filePath, newModel);
    //         ed.setModel(newModel);
    //         this.setActiveModel(newModel, filePath);
    //         console.log("created model...: ", newModel);
    //     }
    //     this.notifyDirty();
    // }

    async save(): Promise<void> {
        const ed = this.editor;
        const current = ed?.getModel() ?? this.currentModel;
        if (current == null) {
            return;
        }

        const uri = current.uri;
        if (uri.scheme !== "file") {
            console.warn("save: active model has no file path (not saved)");
            return;
        }

        const pathKey = uri.fsPath;
        const content = current.getValue();
        await window.electronAPI.writeFile(pathKey, content);
        this.savedVersionByPath.set(pathKey, current.getAlternativeVersionId());
    }

    // isModifiedForPath(filePath: string): boolean {
    //     const m = this.models.get(filePath);
    //     if (m == null) {
    //         return false;
    //     }
    //     const uri = m.uri;
    //     if (uri.scheme !== "file") {
    //         return false;
    //     }
    //     const pathKey = uri.fsPath;
    //     const saved = this.savedVersionByPath.get(pathKey);
    //     if (saved === undefined) {
    //         return false;
    //     }
    //     return m.getAlternativeVersionId() !== saved;
    // }

    // isModified() {
    //     const m = this.currentModel;
    //     if (m == null) {
    //         return false;
    //     }
    //     const uri = m.uri;
    //     if (uri.scheme !== "file") {
    //         return false;
    //     }
    //     return this.isModifiedForPath(uri.fsPath);
    // }

    getEditor() {
        return this.editor;
    }

    setRef(ref: RefObject<HTMLDivElement | null>) {
        this.editorRef = ref;
    }

    getModel() {
        return this.currentModel
    }
}