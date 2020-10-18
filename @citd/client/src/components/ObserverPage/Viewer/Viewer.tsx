import { isChange, isSelections, Change, Operation, Player, Selection } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import * as React from 'react';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { useSocketContext } from '../../../context/socket';

import './Viewer.css';

type ViewerProps = {
  player: Player;
};

type ViewerState =
  | { iframeAPos: 'above'; iframeBPos: 'below'; iframeADoc?: string; iframeBDoc?: string }
  | { iframeAPos: 'below'; iframeBPos: 'above'; iframeADoc?: string; iframeBDoc?: string };

const ViewerComponent: React.FC<ViewerProps> = ({ player }) => {
  const socket = useSocketContext();

  const [codeViewer, setCodeViewer] = React.useState<CodeMirror.Editor>();
  const initCodeViewer = React.useCallback((element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }
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

  const isOperationBatched = React.useRef<boolean>(false);

  const [state, setState] = React.useState<ViewerState>(() => ({
    iframeAPos: 'above',
    iframeBPos: 'below',
  }));

  const onLoadA = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, iframeAPos: 'above', iframeBPos: 'below' }));
  }, []);

  const onLoadB = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, iframeAPos: 'below', iframeBPos: 'above' }));
  }, []);

  React.useEffect(() => {
    if (!codeViewer) {
      return;
    }

    const applyChange = (change: Change) => {
      const { text, from, to, origin } = change;
      codeViewer.getDoc().replaceRange(text.join('\n'), from, to, origin);
    };

    const applySelections = (selections: Selection[]) => {
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
    };

    const applyBatchedOperation = (playerId: string, operation: Operation) => {
      if (playerId !== player.id) {
        return;
      }

      if (!isOperationBatched.current) {
        codeViewer.startOperation();
        isOperationBatched.current = true;
      }

      if (isChange(operation)) {
        applyChange(operation);
      } else {
        applySelections(operation);
        if (isOperationBatched.current) {
          codeViewer.endOperation();
          isOperationBatched.current = false;
        }
      }
    };

    const updateIframe = (instance: CodeMirror.Editor) => {
      setState(({ iframeAPos, iframeBPos, iframeADoc, iframeBDoc }) => {
        const doc = instance.getValue();
        return iframeAPos === 'above' && iframeBPos === 'below'
          ? iframeBDoc === doc
            ? { iframeBPos: 'above', iframeAPos: 'below', iframeADoc, iframeBDoc }
            : { iframeAPos: 'above', iframeBPos: 'below', iframeADoc, iframeBDoc: doc }
          : iframeADoc === doc
          ? { iframeAPos: 'above', iframeBPos: 'below', iframeADoc, iframeBDoc }
          : { iframeAPos: 'below', iframeBPos: 'above', iframeADoc: doc, iframeBDoc };
      });
    };

    const onPlayerTimeline = (playerId: string, operations: Operation[]) => {
      if (playerId !== player.id) {
        return;
      }
      socket.off('playerTimeline', onPlayerTimeline);

      if (!codeViewer) {
        return;
      }

      codeViewer.on('changes', updateIframe);
      if (operations.length === 0) {
        return;
      }
      codeViewer.operation(() => {
        // Apply only Changes first:
        operations.forEach((operation) => {
          if (isChange(operation)) {
            applyChange(operation);
          }
        });
        // Apply selection if it's the last one:
        const lastOperation = operations[operations.length - 1];
        if (isSelections(lastOperation)) {
          applySelections(lastOperation);
        }
      });

      socket.on('operation', applyBatchedOperation);
    };

    socket.on('playerTimeline', onPlayerTimeline);
    socket.emit('getPlayerTimeline', player.id);

    return () => {
      codeViewer.off('change', updateIframe);
      socket.off('operation', applyBatchedOperation);
    };
  }, [codeViewer, player.id, socket]);

  const { iframeAPos, iframeBPos, iframeADoc, iframeBDoc } = state;
  return (
    <div className="viewer">
      <div className="html-viewer box-glitchy-white">
        {typeof iframeADoc === 'string' && (
          <iframe
            onLoad={onLoadA}
            srcDoc={iframeADoc}
            className={iframeAPos}
            sandbox="allow-scripts"
          />
        )}
        {typeof iframeBDoc === 'string' && (
          <iframe
            onLoad={onLoadB}
            srcDoc={iframeBDoc}
            className={iframeBPos}
            sandbox="allow-scripts"
          />
        )}
      </div>
      <div className="player-name">{player.name}</div>
      <div ref={initCodeViewer} className="code-viewer box-glitchy-white" />
    </div>
  );
};

export const Viewer = React.memo(ViewerComponent);
