import { isChange, isSelections, Operation } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import applyEmmetPlugin from '@emmetio/codemirror-plugin';
import * as React from 'react';

applyEmmetPlugin(CodeMirror);
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/keymap/sublime.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { GameContext, withGame } from '../../../context/game';
import { ISocketContext, withSocket } from '../../../context/socket';
import { UserContext, withUser } from '../../../context/user';
import { Timer } from '../../Timer';
import { PlayerPaused } from '../PlayerPaused';

import { task, color } from '../../../task';

import './Playground.css';

type PlaygroundProps = ISocketContext & UserContext & GameContext;

class PlaygroundComponent extends React.PureComponent<PlaygroundProps> {
  private codeEditor?: CodeMirror.Editor;
  private codeEditorRef = React.createRef<HTMLDivElement>();

  state = {
    isConfirm: false,
  };

  componentDidMount() {
    this.codeEditor = CodeMirror(this.codeEditorRef.current!, {
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
    });

    const onPlayerTimeline = (playerId: string, operations: Operation[]) => {
      if (playerId !== this.props.user.id) {
        return;
      }
      this.props.socket.off('playerTimeline', onPlayerTimeline);

      if (operations.length === 0 || !this.codeEditor) {
        return;
      }

      const doc = this.codeEditor.getDoc();
      this.codeEditor.operation(() => {
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
      this.codeEditor.focus();

      this.codeEditor.on('change', this.emitChange);
      this.codeEditor.on('cursorActivity', this.emitSelections);
    };

    this.props.socket.on('playerTimeline', onPlayerTimeline);
    this.props.socket.emit('getPlayerTimeline', this.props.user.id);
  }

  componentWillUnmount() {
    if (!this.codeEditor) {
      return;
    }
    this.codeEditor.off('change', this.emitChange);
    this.codeEditor.off('cursorActivity', this.emitSelections);
  }

  componentDidUpdate(prevProps: PlaygroundProps) {
    if (!this.codeEditor) {
      return;
    }
    if (this.props.game.status === 'playing') {
      if (prevProps.game.status !== 'playing') {
        this.codeEditor.setOption('readOnly', false);
      }
    } else if (prevProps.game.status === 'playing') {
      this.codeEditor.setOption('readOnly', true);
    }
  }

  private emitChange = (instance: CodeMirror.Editor, change: CodeMirror.EditorChangeLinkedList) => {
    this.props.socket.emit('operation', this.props.user.id, change);
  };

  private emitSelections = (instance: CodeMirror.Editor) => {
    const selections = instance.getDoc().listSelections();
    this.props.socket.emit('operation', this.props.user.id, selections);
  };

  render() {
    const { game } = this.props;
    return (
      <div className="playground-wrapper">
        <h1 className="text-glitchy-large">Code in the Dark</h1>
        <div className="playground">
          <div ref={this.codeEditorRef} className="code-editor box-glitchy-white" />
          <div className="sidebar">
            <div
              className="box-glitchy-white sidebar-preview"
              style={{ backgroundColor: color, backgroundImage: `url(${task})` }}
            />
            <Timer />
            {/* <img src={task} className='gameTask' /> */}
          </div>
          {game.status === 'paused' && <PlayerPaused />}
        </div>
      </div>
    );
  }
}

export const Playground = withSocket(withUser(withGame(PlaygroundComponent)));
