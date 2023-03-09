import { isChange, isSelections, Change, Operation, Player, Selection } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import * as React from 'react';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { ResultViewer } from './ResultViewer';
import './Viewer.css';

type ViewerProps = {
  player: Player;
  operations: Operation[];
};

const ViewerComponent: React.VFC<ViewerProps> = ({ player, operations }) => {
  // Init code viewer in readonly mode:
  const [codeViewer, setCodeViewer] = React.useState<CodeMirror.Editor>();
  const initCodeViewer = React.useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    setCodeViewer(
      CodeMirror(element, {
        readOnly: true,
        lineNumbers: true,
        mode: 'text/html',
        theme: 'material',
        tabSize: 2,
      }),
    );
  }, []);

  // Subscribe to changes in the editor which will generate the resulting document:
  const [iFrameContent, setIFrameContent] = React.useState('');
  React.useEffect(() => {
    if (!codeViewer) return;
    function updateIframe(instance: CodeMirror.Editor) {
      setIFrameContent(instance.getValue());
    }
    codeViewer.on('changes', updateIframe);
    return () => {
      codeViewer.off('changes', updateIframe);
    };
  }, [codeViewer]);

  // Apply most recent changes to the editor:
  const nbOperationsApplied = React.useRef<number>(0);
  React.useEffect(() => {
    if (!codeViewer) return;

    const changesSinceLastUpdate = operations.slice(nbOperationsApplied.current);
    nbOperationsApplied.current = operations.length;

    if (changesSinceLastUpdate.length === 0) return;

    codeViewer.operation(() => {
      // Apply only Changes first:
      changesSinceLastUpdate.forEach((operation) => {
        if (isChange(operation)) {
          applyChange(codeViewer, operation);
        }
      });
      // Apply selection if it's the last one:
      const lastOperation = changesSinceLastUpdate[changesSinceLastUpdate.length - 1];
      if (isSelections(lastOperation)) {
        applySelections(codeViewer, lastOperation);
      }
    });
  }, [codeViewer, player.id, operations]);

  return (
    <div className="viewer">
      {/* Result viewer */}
      <div className="html-viewer box-glitchy-white">
        <ResultViewer content={iFrameContent} />
      </div>
      {/* Code viewer */}
      <div className="player-name">{player.name}</div>
      <div ref={initCodeViewer} className="code-viewer box-glitchy-white" />
    </div>
  );
};

export const Viewer = React.memo(ViewerComponent);

function applyChange(codeViewer: CodeMirror.Editor, change: Change) {
  const { text, from, to, origin } = change;
  codeViewer.getDoc().replaceRange(text.join('\n'), from, to, origin);
}

function applySelections(codeViewer: CodeMirror.Editor, selections: Selection[]) {
  const doc = codeViewer.getDoc();
  doc.getAllMarks().forEach((mark) => mark.clear());
  doc.setSelections(selections);
  selections.forEach((selection) => {
    const cursorElement = document.createElement('div');
    cursorElement.className = 'cursor';
    doc.setBookmark(selection.head, {
      widget: cursorElement,
      insertLeft: true,
    });
  });
}
