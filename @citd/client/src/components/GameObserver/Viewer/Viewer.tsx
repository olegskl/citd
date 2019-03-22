import { IGamePlayer } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import * as React from 'react';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { ISocketContext, withSocket } from '../../../context/socket';

import './Viewer.css';

interface IViewerProps extends ISocketContext {
  player: IGamePlayer;
  size: number;
}

class ViewerComponent extends React.PureComponent<IViewerProps> {
  private codeViewer?: CodeMirror.Editor;
  private codeViewerRef = React.createRef<HTMLDivElement>();
  private htmlViewerRef = React.createRef<HTMLIFrameElement>();
  private isOperationBatched = false;

  componentDidMount() {
    const {id, changes, selections} = this.props.player;
    this.codeViewer = CodeMirror(this.codeViewerRef.current!, {
      readOnly: true,
      lineNumbers: true,
      mode: 'text/html',
      theme: 'material',
      tabSize: 2
    });

    if (changes.length > 0) {
      const doc = this.codeViewer.getDoc();
      this.codeViewer.operation(() => {
        changes.forEach(({text, from, to, origin}) => {
          doc.replaceRange(text.join('\n'), from, to, origin);
        });
      });
    }
    this.applySelections(id, selections);

    this.codeViewer.on('change', this.updateIframe);
    this.props.socket.on('change', this.applyChange);
    this.props.socket.on('selections', this.applySelections);
  }

  componentWillUnmount() {
    if (this.codeViewer) {
      this.codeViewer.off('change', this.updateIframe);
    }
    this.props.socket.off('change', this.applyChange);
    this.props.socket.off('selections', this.applySelections);
  }

  private updateIframe = (instance: CodeMirror.Editor) => {
    this.htmlViewerRef.current!.contentWindow!.document.open();
    this.htmlViewerRef.current!.contentWindow!.document.write(instance.getValue());
    this.htmlViewerRef.current!.contentWindow!.document.close();
  }

  private applyChange = (playerId: string, change: CodeMirror.EditorChangeLinkedList) => {
    if (!this.codeViewer) { return; }
    if (!this.isOperationBatched) {
      this.codeViewer.startOperation();
      this.isOperationBatched = true;
    }
    const {text, from, to, origin} = change;
    this.codeViewer.getDoc().replaceRange(text.join('\n'), from, to, origin);
  }

  private applySelections = (playerId: string, selections: IGamePlayer['selections']) => {
    if (!this.codeViewer) { return; }
    if (!this.isOperationBatched) {
      this.codeViewer.startOperation();
      this.isOperationBatched = true;
    }
    const doc = this.codeViewer.getDoc();
    doc.getAllMarks().forEach(mark => mark.clear());
    doc.setSelections(selections);
    selections.forEach(selection => {
      const cursorElement = document.createElement('div');
      cursorElement.className = 'cursor';
      doc.setBookmark(selection.head, {
        widget: cursorElement,
        insertLeft: true
      });
    });
    if (this.isOperationBatched) {
      this.codeViewer.endOperation();
      this.isOperationBatched = false;
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
