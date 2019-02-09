import { IGamePlayer } from '@citd/shared';
import { editor, IDisposable } from 'monaco-editor';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../../context/socket';

import * as taskImg from '../../../assets/task.png';

import './Playground.css';

interface IPlaygroundProps extends ISocketContext {
  player: IGamePlayer;
  onLeaveGame: () => void;
}

class PlaygroundComponent extends React.PureComponent<IPlaygroundProps> {
  private offDidChangeContent?: IDisposable;
  private model = editor.createModel('', 'html');
  private editorRef = React.createRef<HTMLDivElement>();
  
  state = {
    isConfirm: false
  };

  componentDidMount() {
    editor.create(this.editorRef.current!, {
      model: this.model,
      theme: 'vs-dark',
      minimap: {enabled: false},
      fontSize: 18
    });

    this.model.setValue(this.props.player.model);
    this.offDidChangeContent = this.model.onDidChangeContent(e => {
      this.props.socket.emit('commitChanges', this.props.player.id, e.changes);
      this.props.socket.emit('commitModel', this.props.player.id, this.model.getValue());
    });
  }

  componentWillUnmount() {
    if (this.offDidChangeContent) {
      this.offDidChangeContent.dispose();
    }
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

  render() {
    return (
      <>
        <div ref={this.editorRef} className='gameEditor' />
        <img src={taskImg} className='gameTask' />
        {this.state.isConfirm ? (
          <div className="abandon-game-confirm">
            <span className="confirm-message">Sure?</span>
            <button 
              onClick={this.props.onLeaveGame}
              className="button-yes"
            >
              Yes, it's hard for me :(
            </button>
            <button 
              onClick={this.denyAbandon}
              className="button-no"
            >
              No, please!
            </button>
          </div>
        ) : (
          <button
            onClick={this.confirmAbandon}
            className='abandon-game'
          >
            Abandon game
          </button>
        )}
      </>
    );
  }
};

export const Playground = withSocket(PlaygroundComponent);
