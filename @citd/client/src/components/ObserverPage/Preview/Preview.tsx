import * as React from 'react';

import { Timer } from '../../Timer';
import { task, color } from '../../../task';

import './Preview.css';

export const Preview: React.VFC = () => (
  <div className="preview">
    <div
      className="html-viewer box-glitchy-white"
      style={{ backgroundColor: color, backgroundImage: `url(${task})` }}
    />
    <div className="scores">
      <Timer />
    </div>
  </div>
);
