import { GameStatus, isChange, isSelections, Operation } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import applyEmmetPlugin from '@emmetio/codemirror-plugin';
import * as React from 'react';

applyEmmetPlugin(CodeMirror);
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/keymap/sublime.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { Timer } from '../../Timer';
import { GamePausedOverlay } from '../GamePausedOverlay';

import { useGameContext } from '../../../context/game';
import { task, color } from '../../../task';

import './Playground.css';

const PlaygroundComponent: React.VFC = () => {
  const { game, playerId, dispatch } = useGameContext();
  const isGamePaused = game.status === GameStatus.PAUSED;

  const [codeEditor, setCodeEditor] = React.useState<CodeMirror.Editor>();
  const initCodeEditor = React.useCallback((element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }
    setCodeEditor(
      CodeMirror(element, {
        lineNumbers: true,
        mode: 'text/html',
        theme: 'material',
        tabSize: 2,
        keyMap: 'sublime',
        showCursorWhenSelecting: true,
        extraKeys: {
          Tab: 'emmetExpandAbbreviation',
          Enter: 'emmetInsertLineBreak',
        },
      }),
    );
  }, []);

  React.useEffect(() => {
    if (!codeEditor) return;

    const emitChange = (_: CodeMirror.Editor, change: CodeMirror.EditorChangeLinkedList) => {
      dispatch({ type: 'operation', payload: change });
    };

    const emitSelections = (instance: CodeMirror.Editor) => {
      const selections = instance.getDoc().listSelections();
      dispatch({ type: 'operation', payload: selections });
    };

    const operations: Operation[] = game.operations
      .filter(({ userId }) => !userId || userId === playerId)
      .map(({ operation }) => operation);

    const doc = codeEditor.getDoc();
    codeEditor.operation(() => {
      // Apply only Changes first:
      operations.forEach((operation) => {
        if (isChange(operation)) {
          const { text, from, to, origin } = operation;
          doc.replaceRange(text.join('\n'), from, to, origin);
        }
      });
      // Apply selection if it's the last one:
      const lastOperation = operations[operations.length - 1];
      if (isSelections(lastOperation)) {
        doc.setSelections(lastOperation);
      }
    });
    codeEditor.focus();

    codeEditor.on('change', emitChange);
    codeEditor.on('cursorActivity', emitSelections);

    return () => {
      codeEditor.off('change', emitChange);
      codeEditor.off('cursorActivity', emitSelections);
    };
  }, [codeEditor, playerId]);

  React.useEffect(() => {
    if (codeEditor) {
      codeEditor.setOption('readOnly', isGamePaused);
    }
  }, [codeEditor, isGamePaused]);

  return (
    <div className="playground-wrapper">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      <div className="playground">
        <div ref={initCodeEditor} className="code-editor box-glitchy-white" />
        <div className="sidebar">
          <div
            className="box-glitchy-white sidebar-preview"
            style={{ backgroundColor: color, backgroundImage: `url(${task})` }}
          />
          <Timer />
        </div>
        {isGamePaused && <GamePausedOverlay />}
      </div>
    </div>
  );
};

export const Playground = React.memo(PlaygroundComponent);
