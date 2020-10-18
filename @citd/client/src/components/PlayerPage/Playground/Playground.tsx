import { isChange, isSelections, Operation } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import applyEmmetPlugin from '@emmetio/codemirror-plugin';
import * as React from 'react';

applyEmmetPlugin(CodeMirror);
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/keymap/sublime.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { Timer } from '../../Timer';
import { PlayerPaused } from '../PlayerPaused';

import { useGameContext } from '../../../context/game';
import { useSocketContext } from '../../../context/socket';
import { useUserContext } from '../../../context/user';
import { task, color } from '../../../task';

import './Playground.css';

const PlaygroundComponent: React.FC = () => {
  const socket = useSocketContext();
  const game = useGameContext();
  const user = useUserContext();

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
    if (!codeEditor) {
      return;
    }

    const emitChange = (
      _instance: CodeMirror.Editor,
      change: CodeMirror.EditorChangeLinkedList,
    ) => {
      socket.emit('operation', user.id, change);
    };

    const emitSelections = (instance: CodeMirror.Editor) => {
      const selections = instance.getDoc().listSelections();
      socket.emit('operation', user.id, selections);
    };

    const onPlayerTimeline = (playerId: string, operations: Operation[]) => {
      if (playerId !== user.id) {
        return;
      }
      socket.off('playerTimeline', onPlayerTimeline);

      if (operations.length === 0 || !codeEditor) {
        return;
      }

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
    };

    socket.on('playerTimeline', onPlayerTimeline);
    socket.emit('getPlayerTimeline', user.id);

    return () => {
      codeEditor.off('change', emitChange);
      codeEditor.off('cursorActivity', emitSelections);
    };
  }, [codeEditor, socket, user.id]);

  React.useEffect(() => {
    if (!codeEditor) {
      return;
    }
    codeEditor.setOption('readOnly', game.status !== 'playing');
  }, [codeEditor, game.status]);

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
        {game.status === 'paused' && <PlayerPaused />}
      </div>
    </div>
  );
};

export const Playground = React.memo(PlaygroundComponent);
