import { emmetHTML } from 'emmet-monaco-es';
import * as monaco from 'monaco-editor';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { theme } from './theme';
import './useCodeEditor.css';

emmetHTML(monaco);

export type CodeEditorHookOptions = {
  autoFocus?: boolean;
  readOnly?: boolean;
  onChange?: (changes: monaco.editor.IModelContentChangedEvent['changes']) => void;
};

export function useCodeEditor({ autoFocus, readOnly = false }: CodeEditorHookOptions) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const editor = monaco.editor.create(containerRef.current, {
      readOnly,
      automaticLayout: true,
      contextmenu: false,
      minimap: { enabled: false },
      language: 'html',
      theme: theme,
      tabSize: 2,
      scrollBeyondLastLine: false,
      renderLineHighlight: 'none',
      fontSize: 20,
      hover: { enabled: false },
      roundedSelection: false,
      overviewRulerBorder: false,
      overviewRulerLanes: 0,
      lineNumbersMinChars: 3,
      padding: { top: 10, bottom: 10 },
      scrollbar: {
        horizontalScrollbarSize: 10,
        verticalScrollbarSize: 10,
        useShadows: false,
      },
    });
    if (autoFocus) editor.focus();
    setEditor(editor);
    return () => editor.dispose();
  }, []);

  useEffect(() => {
    if (!editor) return;
    editor.updateOptions({ readOnly });
  }, [editor, readOnly]);

  return { editor, containerRef };
}
