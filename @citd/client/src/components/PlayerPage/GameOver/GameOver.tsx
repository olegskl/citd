import { Change, isChange } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import * as React from 'react';
import { useGameContext } from '../../../context/game';
import { ResultViewer } from '../../ObserverPage/Viewer/ResultViewer';

import './GameOver.css';

const GameOverComponent: React.VFC = () => {
  const { game, playerId } = useGameContext();
  const operations = game.operations
    .filter(({ userId }) => !userId || userId === playerId)
    .map(({ operation }) => operation);

  const editor = CodeMirror(document.createElement('div'), {
    readOnly: true,
    mode: 'text/html',
  });

  editor.operation(() => {
    // Apply only changes:
    operations.forEach((operation) => {
      if (isChange(operation)) {
        applyChange(editor, operation);
      }
    });
  });

  const iFrameContent = editor.getValue();

  return (
    <div className="game-over">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      <div className="text-glitchy-medium">Game over</div>
      <div className="html-viewer box-glitchy-white">
        <ResultViewer content={iFrameContent} />
      </div>
    </div>
  );
};

export const GameOver = React.memo(GameOverComponent);

function applyChange(codeViewer: CodeMirror.Editor, change: Change) {
  const { text, from, to, origin } = change;
  codeViewer.getDoc().replaceRange(text.join('\n'), from, to, origin);
}
