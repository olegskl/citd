import * as monaco from 'monaco-editor';
import * as React from 'react';
import { useGameContext } from '../../../context/game';
import { ResultViewer } from '../../ObserverPage/Viewer/ResultViewer';

import './GameOver.css';

const GameOverComponent: React.FC = () => {
  const { game, playerId } = useGameContext();

  const model = monaco.editor.createModel('', 'html');

  game.operations
    .filter(({ userId }) => !userId || userId === playerId)
    .map(({ operation }) => operation)
    .forEach(({ edits }) => {
      if (edits && edits.length > 0) model.applyEdits(edits);
    });

  const iFrameContent = model.getValue();

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
