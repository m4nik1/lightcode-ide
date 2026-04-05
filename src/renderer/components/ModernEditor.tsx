import { useEffect, useRef } from 'react';
import { init } from 'modern-monaco'

export default async function ModernEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const setupEditor = async () => {
    // let disposed = false;

    if(!editorRef.current) {
      return;
    }
  
    const monaco = await init({
      defaultTheme: 'one-dark-pro'
    })

    const model = monaco.editor.createModel('console.log("Hello world");\n',
        'javascript');

    monaco.editor.create(editorRef.current, { model});
  }

  useEffect(() => {
    setupEditor();
  })
  

  return (
    <div ref={editorRef}
      style={{
        width: '100%',
        height: '60vh',
        minHeight: '420px',
        borderRadius: '16px',
        overflow: 'hidden',
      }} 
    />
  );
}