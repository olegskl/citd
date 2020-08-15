import { isChange, isSelections, Change, Operation, Player, Selection } from '@citd/shared';
import * as CodeMirror from 'codemirror';
import * as React from 'react';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { ISocketContext, withSocket } from '../../../context/socket';

import './Viewer.css';

interface ViewerProps extends ISocketContext {
  player: Player;
}

type ViewerState =
  | { iframeAPos: 'above'; iframeBPos: 'below'; iframeADoc?: string; iframeBDoc?: string }
  | { iframeAPos: 'below'; iframeBPos: 'above'; iframeADoc?: string; iframeBDoc?: string };

class ViewerComponent extends React.PureComponent<ViewerProps, ViewerState> {
  private codeViewer?: CodeMirror.Editor;
  private codeViewerRef = React.createRef<HTMLDivElement>();
  private isOperationBatched = false;

  state: ViewerState = {
    iframeAPos: 'above',
    iframeBPos: 'below',
  };

  componentDidMount() {
    this.codeViewer = CodeMirror(this.codeViewerRef.current!, {
      readOnly: true,
      lineNumbers: true,
      mode: 'text/html',
      theme: 'material',
      tabSize: 2,
    });

    const onPlayerTimeline = (playerId: string, operations: Operation[]) => {
      if (playerId !== this.props.player.id) {
        return;
      }
      this.props.socket.off('playerTimeline', onPlayerTimeline);

      if (!this.codeViewer) {
        return;
      }

      this.codeViewer.on('changes', this.updateIframe);
      if (operations.length === 0) {
        return;
      }
      this.codeViewer.operation(() => {
        // Apply only Changes first:
        operations.forEach((operation) => {
          if (isChange(operation)) {
            this.applyChange(operation);
          }
        });
        // Apply selection if it's the last one:
        const lastOperation = operations[operations.length - 1];
        if (isSelections(lastOperation)) {
          this.applySelections(lastOperation);
        }
      });

      this.props.socket.on('operation', this.applyBatchedOperation);
    };

    this.props.socket.on('playerTimeline', onPlayerTimeline);
    this.props.socket.emit('getPlayerTimeline', this.props.player.id);
  }

  componentWillUnmount() {
    if (this.codeViewer) {
      this.codeViewer.off('change', this.updateIframe);
    }
    this.props.socket.off('operation', this.applyBatchedOperation);
  }

  private applyChange = (change: Change) => {
    if (!this.codeViewer) {
      return;
    }
    const { text, from, to, origin } = change;
    this.codeViewer.getDoc().replaceRange(text.join('\n'), from, to, origin);
  };

  private applySelections = (selections: Selection[]) => {
    if (!this.codeViewer) {
      return;
    }
    const doc = this.codeViewer.getDoc();
    doc.getAllMarks().forEach((mark) => mark.clear());
    doc.setSelections(selections);
    selections.forEach((selection) => {
      const cursorElement = document.createElement('div');
      cursorElement.className = 'cursor';
      doc.setBookmark(selection.head, {
        widget: cursorElement,
        insertLeft: true,
      });
    });
  };

  private applyBatchedOperation = (playerId: string, operation: Operation) => {
    if (playerId !== this.props.player.id) {
      return;
    }
    if (!this.codeViewer) {
      return;
    }

    if (!this.isOperationBatched) {
      this.codeViewer.startOperation();
      this.isOperationBatched = true;
    }

    if (isChange(operation)) {
      this.applyChange(operation);
    } else {
      this.applySelections(operation);
      if (this.isOperationBatched) {
        this.codeViewer.endOperation();
        this.isOperationBatched = false;
      }
    }
  };

  private onLoadA = () => {
    this.setState({ iframeAPos: 'above', iframeBPos: 'below' });
  };

  private onLoadB = () => {
    this.setState({ iframeAPos: 'below', iframeBPos: 'above' });
  };

  private updateIframe = (instance: CodeMirror.Editor) => {
    this.setState(({ iframeAPos, iframeBPos, iframeADoc, iframeBDoc }) => {
      const doc = instance.getValue();
      return iframeAPos === 'above' && iframeBPos === 'below'
        ? iframeBDoc === doc
          ? { iframeBPos: 'above', iframeAPos: 'below', iframeADoc, iframeBDoc }
          : { iframeAPos, iframeBPos, iframeADoc, iframeBDoc: doc }
        : iframeADoc === doc
        ? { iframeAPos: 'above', iframeBPos: 'below', iframeADoc, iframeBDoc }
        : { iframeAPos, iframeBPos, iframeADoc: doc, iframeBDoc };
    });
  };

  render() {
    const { iframeAPos, iframeBPos, iframeADoc, iframeBDoc } = this.state;
    return (
      <div className="viewer">
        <div className="html-viewer box-glitchy-white">
          {typeof iframeADoc === 'string' && (
            <iframe
              onLoad={this.onLoadA}
              srcDoc={iframeADoc}
              className={iframeAPos}
              sandbox="allow-scripts"
            />
          )}
          {typeof iframeBDoc === 'string' && (
            <iframe
              onLoad={this.onLoadB}
              srcDoc={iframeBDoc}
              className={iframeBPos}
              sandbox="allow-scripts"
            />
          )}
        </div>
        <div className="player-name">{this.props.player.name}</div>
        <div ref={this.codeViewerRef} className="code-viewer box-glitchy-white" />
      </div>
    );
  }
}

export const Viewer = withSocket(ViewerComponent);
