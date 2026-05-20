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
    private models: mEditor.ITextModel[];
    private currentModel: mEditor.ITextModel | null;
    private onModifiedChange: ((filePath: string, isModified: boolean) => void) | null;
    private contentDisposables = new Map<string, { dispose: () => void }>();

    constructor(ref: RefObject<HTMLDivElement | null> | null) {
        this.editorRef = ref ?? { current: null };
        this.editor = null;
        this.monaco = null;
        this.models = [];
        this.currentModel = null;
        this.onModifiedChange = null;
    }

    setOnModifiedChange(callback: (filePath: string, isModified: boolean) => void) {
        this.onModifiedChange = callback;
    }

    private registerSaveKeybinding() {
        if (this.editor == null || this.monaco == null) {
            return;
        }
        const { KeyMod, KeyCode } = this.monaco;
        this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
            void this.save();
        });
    }

    async createEditor(filePath: string) {
        this.monaco = await init();

        if (this.editor == null) {
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
            this.onContentChange();
            this.registerSaveKeybinding();
            this.models.push(this.currentModel)
            this.editor.setModel(this.currentModel);
        } else {
            const modelExist = this.models.some((model) => model.uri.path === filePath);
            if(modelExist) {
                this.currentModel = this.models.find((model) => model.uri.path === filePath) as mEditor.ITextModel;
                this.editor.setModel(this.currentModel);
                return;
            } else {
                this.currentModel = await new m4model().createModel(this.monaco, filePath); 
                this.onContentChange();
                this.registerSaveKeybinding();
                this.editor.setModel(this.currentModel);
                this.models.push(this.currentModel)
            }
        }
    }

    getModels() {
        return this.models
    }

    disposeModel(filePath: string) {
        const model = this.models.find((m) => m.uri.fsPath === filePath);
        if (model == null) {
            return;
        }

        if (this.editor?.getModel() === model) {
            this.editor.setModel(null);
        }

        this.contentDisposables.get(filePath)?.dispose();
        this.contentDisposables.delete(filePath);

        model.dispose();
        this.models = this.models.filter((m) => m.uri.fsPath !== filePath);

        if (this.currentModel === model) {
            this.currentModel = null;
        }
    }

    onContentChange() {
        const model = this.currentModel;
        if (model == null || model.uri.scheme !== "file") {
            return;
        }

        const filePath = model.uri.fsPath;
        const existing = this.contentDisposables.get(filePath);
        existing?.dispose();

        const disposable = model.onDidChangeContent(() => {
            this.onModifiedChange?.(filePath, true);
        });
        this.contentDisposables.set(filePath, disposable);
    }

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
        this.onModifiedChange?.(pathKey, false);
    }

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