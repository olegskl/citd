import { IGamePlayer } from '@citd/shared';
import { editor, IDisposable } from 'monaco-editor';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../../context/socket';
import { Timer } from '../../Timer';

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
        <div ref={this.editorRef} className='gameEditor' />
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
