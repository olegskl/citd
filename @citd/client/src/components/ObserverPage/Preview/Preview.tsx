import * as React from 'react';

import { Timer } from '../../Timer';
import { tasks } from '../../../task';

import './Preview.css';

type PreviewProps = { taskId: string };

export function Preview({ taskId }: PreviewProps) {
  const task = tasks[taskId];
  return (
    <div className="preview">
      <div
        className="html-viewer box-glitchy-white"
        style={{ backgroundColor: task.color, backgroundImage: `url(${task.url})` }}
      />
      <div className="scores">
        <Timer />
      </div>
    </div>
  );
}
