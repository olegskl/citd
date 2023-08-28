import { GameStatus } from '@citd/shared';
import * as React from 'react';
import { useCodeEditor } from '../../CodeEditor';
import { Timer } from '../../Timer';
import { GamePausedOverlay } from '../GamePausedOverlay';
import { useGameContext } from '../../../context/game';
import { task, color } from '../../../task';

import './Playground.css';

const PlaygroundComponent = () => {
  const { game, playerId, dispatch } = useGameContext();
  const isGamePaused = game.status === GameStatus.PAUSED;
  const { containerRef, editor } = useCodeEditor({ autoFocus: false, readOnly: true });

  React.useEffect(() => {
    if (!editor || !playerId) return;
    const model = editor.getModel();
    if (!model) return;

    game.operations
      .filter(({ userId }) => !userId || userId === playerId)
      .map(({ operation }) => operation)
      .forEach(({ edits, selections }) => {
        if (edits && edits.length > 0) model.applyEdits(edits);
        if (selections && selections.length > 0) editor.setSelections(selections);
      });

    editor.focus();
  }, [editor, playerId]);

  React.useEffect(() => {
    if (!editor) return;

    const onDidChangeModelContentDisposable = editor.onDidChangeModelContent((e) => {
      dispatch({ type: 'operation', payload: { edits: e.changes } });
    });
    const onDidChangeCursorSelectionDisposable = editor.onDidChangeCursorSelection((e) => {
      dispatch({
        type: 'operation',
        payload: { selections: [e.selection, ...e.secondarySelections] },
      });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        editor.getAction('editor.action.formatDocument')?.run();
      }
    });

    editor.updateOptions({ readOnly: false });

    return () => {
      onDidChangeModelContentDisposable.dispose();
      onDidChangeCursorSelectionDisposable.dispose();
    };
  }, [dispatch, editor]);

  return (
    <div className="playground-wrapper">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      <div className="playground">
        <div ref={containerRef} className="editor-wrapper box-glitchy-white" />
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
