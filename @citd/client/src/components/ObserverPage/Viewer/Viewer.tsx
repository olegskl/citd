import { Operation, Player } from '@citd/shared';
import * as React from 'react';

import { ResultViewer } from './ResultViewer';
import './Viewer.css';
import { useCodeEditor } from '../../CodeEditor';

type ViewerProps = {
  player: Player;
  operations: Operation[];
};

const ViewerComponent: React.FC<ViewerProps> = ({ player, operations }) => {
  const { containerRef, editor } = useCodeEditor({ autoFocus: false, readOnly: true });

  // Subscribe to changes in the editor which will generate the resulting document:
  const [iFrameContent, setIFrameContent] = React.useState('');
  React.useEffect(() => {
    if (!editor) return;
    const onDidChangeModelContentDisposable = editor.onDidChangeModelContent(() => {
      const model = editor.getModel();
      if (model) setIFrameContent(model.getValue());
    });
    return () => onDidChangeModelContentDisposable.dispose();
  }, [editor]);

  React.useEffect(() => {
    if (!editor) return;
    const decorations = editor.createDecorationsCollection([]);

    const dis = editor.onDidChangeCursorSelection(({ selection, secondarySelections }) => {
      const selections = [selection, ...secondarySelections];

      decorations.set(
        selections.map(({ positionColumn, positionLineNumber }) => ({
          range: {
            startColumn: positionColumn,
            endColumn: positionColumn,
            endLineNumber: positionLineNumber,
            startLineNumber: positionLineNumber,
          },
          options: {
            beforeContentClassName: 'cursor-custom',
          },
        })),
      );

      editor
        .getContainerDomNode()
        .querySelectorAll('.cursor-custom')
        .forEach((el) => {
          el.getAnimations().forEach((animation) => {
            animation.cancel();
            animation.play();
          });
        });
    });

    return () => {
      dis.dispose();
      decorations.clear();
    };
  }, [editor]);

  // Apply most recent changes to the editor:
  const nbOperationsApplied = React.useRef<number>(0);
  React.useEffect(() => {
    if (!editor) return;
    const changesSinceLastUpdate = operations.slice(nbOperationsApplied.current);
    nbOperationsApplied.current = operations.length;

    if (changesSinceLastUpdate.length === 0) return;

    changesSinceLastUpdate.forEach(({ edits, selections }) => {
      if (edits && edits.length > 0) editor.getModel()?.applyEdits(edits);
      if (selections && selections.length > 0) {
        editor.setSelections(selections);
      }
    });
    const pos = editor.getPosition();
    if (pos) {
      editor.revealPositionInCenterIfOutsideViewport(pos);
    }
  }, [editor, player.id, operations]);

  return (
    <div className="viewer">
      {/* Result viewer */}
      <div className="html-viewer box-glitchy-white">
        <ResultViewer content={iFrameContent} />
        <div className="player-name">{player.name}</div>
      </div>
      {/* Code viewer */}
      <div ref={containerRef} className="code-viewer box-glitchy-white" />
    </div>
  );
};

export const Viewer = React.memo(ViewerComponent);
