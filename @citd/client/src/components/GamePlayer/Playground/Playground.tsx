import { IGamePlayer } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import applyEmmetPlugin from '@emmetio/codemirror-plugin';
import * as React from 'react';

applyEmmetPlugin(CodeMirror);
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/keymap/sublime.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { ISocketContext, withSocket } from '../../../context/socket';
import { Timer } from '../../Timer';

import * as taskImg from '../../../assets/task.png';

import './Playground.css';

interface IPlaygroundProps extends ISocketContext {
  player: IGamePlayer;
  onLeaveGame: () => void;
}

class PlaygroundComponent extends React.PureComponent<IPlaygroundProps> {
  private codeEditor?: CodeMirror.Editor;
  private codeEditorRef = React.createRef<HTMLDivElement>();

  state = {
    isConfirm: false
  };

  componentDidMount() {
    const {changes, selections} = this.props.player;

    this.codeEditor = CodeMirror(this.codeEditorRef.current!, {
      lineNumbers: true,
      mode: 'text/html',
      theme: 'material',
      tabSize: 2,
      keyMap: 'sublime',
      showCursorWhenSelecting: true,
      extraKeys: {
        'Tab': 'emmetExpandAbbreviation',
        'Enter': 'emmetInsertLineBreak'
      }
    });

    const doc = this.codeEditor.getDoc();
    if (changes.length > 0) {
      this.codeEditor.operation(() => {
        changes.forEach(({text, from, to, origin}) => {
          doc.replaceRange(text.join('\n'), from, to, origin);
        });
      });
    }
    doc.setSelections(selections);
    this.codeEditor.focus();

    this.codeEditor.on('change', this.emitChange);
    this.codeEditor.on('cursorActivity', this.emitSelections);
  }

  componentWillUnmount() {
    if (!this.codeEditor) { return; }
    this.codeEditor.off('change', this.emitChange);
    this.codeEditor.off('cursorActivity', this.emitSelections);
  }

  private emitChange = (instance: CodeMirror.Editor, change: CodeMirror.EditorChangeLinkedList) => {
    this.props.socket.emit('change', this.props.player.id, change);
  }

  private emitSelections = (instance: CodeMirror.Editor) => {
    const selections = instance.getDoc().listSelections();
    this.props.socket.emit('selections', this.props.player.id, selections);
  }

  confirmAbandon = () => {
    this.setState({
      isConfirm: true
    });
  };

  denyAbandon = () => {
    this.setState({
      isConfirm: false
    });
  };

  renderAbandonConfirm = () => (
    <div className="abandon-game-confirm">
      <span className="confirm-message">Sure?</span>
      <button
        onClick={this.props.onLeaveGame}
        className="btn-common btn-success"
      >
        Yes, it's hard for me :(
      </button>
      <button
        onClick={this.denyAbandon}
        className="btn-common btn-danger"
      >
        No, please!
      </button>
    </div>
  );

  render() {
    return (
      <>
        <Timer active secondsRemaining={15*60} />
        <div ref={this.codeEditorRef} className='code-editor' />
        <img src={taskImg} className='gameTask' />
        {this.state.isConfirm ? (
          this.renderAbandonConfirm()
        ) : (
          <button
            onClick={this.confirmAbandon}
            className='btn-common btn-danger abandon-game'
          >
            Abandon game
          </button>
        )}
      </>
    );
  }
};

export const Playground = withSocket(PlaygroundComponent);
