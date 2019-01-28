import { IGamePlayer } from '@citd/shared';
import { editor } from 'monaco-editor';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../../context/socket';

import './Viewer.css';

interface IViewerProps extends ISocketContext {
  player: IGamePlayer;
  size: number;
}

class ViewerComponent extends React.PureComponent<IViewerProps> {
  private htmlViewerRef = React.createRef<HTMLIFrameElement>();
  private codeViewerRef = React.createRef<HTMLDivElement>();
  private model = editor.createModel('', 'html');
  private editor: editor.IStandaloneCodeEditor | undefined;

  componentDidMount() {
    this.editor = editor.create(this.codeViewerRef.current!, {
      model: this.model,
      theme: 'vs-dark',
      minimap: {enabled: false},
      fontSize: 20,
      readOnly: true,
      matchBrackets: false,
      hideCursorInOverviewRuler: true,
      lineNumbersMinChars: 3,
      overviewRulerBorder: false,
      renderLineHighlight: 'none',
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden'
      }
    });

    // this.props.socket.on('modelCommitted', this.applyValue);
    this.applyValue(this.props.player.id, this.props.player.model);
    this.props.socket.on('changesCommitted', this.applyEdits);
  }

  componentWillUnmount() {
    // this.props.socket.off('modelCommitted', this.applyValue);
    this.props.socket.off('changesCommitted', this.applyEdits);
  }

  private updateIframe = (value: string) => {
    this.htmlViewerRef.current!.contentWindow!.document.open();
    this.htmlViewerRef.current!.contentWindow!.document.write(value);
    this.htmlViewerRef.current!.contentWindow!.document.close();
  }

  private applyValue = (playerId: string, value: string) => {
    if (this.props.player.id !== playerId) { return; }
    if (value !== this.model.getValue()) {
      this.model.setValue(value);
      this.updateIframe(value);
    }
  }

  private applyEdits = (playerId: string, edits: editor.IIdentifiedSingleEditOperation[]) => {
    if (this.props.player.id !== playerId) { return; }
    this.model.applyEdits(edits);
    this.updateIframe(this.model.getValue());
    const lastEdit = edits[edits.length - 1];
    if (this.editor) {
      this.editor.revealPositionInCenterIfOutsideViewport({
        column: lastEdit.range.endColumn,
        lineNumber: lastEdit.range.endLineNumber
      }, 0)
    }
  }

  render() {
    return (
      <div className='viewer' style={{width: this.props.size * 100 + 'vw'}}>
        <iframe ref={this.htmlViewerRef} className='html-viewer' />
        <div className='player-name'>{this.props.player.nickname}</div>
        <div ref={this.codeViewerRef} className='code-viewer' />
      </div>
    );
  }
}

export const Viewer = withSocket(ViewerComponent);
