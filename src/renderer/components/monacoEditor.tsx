import { useRef } from 'react';
import { init } from 'modern-monaco'

export default async function MonacoEditor() {
  const monaco = await init();
  const editor = monaco.editor.create(document.getElementById('editor'));
  const editorRef = useRef(null);

  editor.setModel(monaco.editor.createModel('console.log("Hello world")', 'Javascript'));

  return (
    <div ref={editorRef} />
  );
}