import * as React from 'react';

import { ISocketContext, withSocket } from '../../../context/socket';
import { Timer } from '../../Timer';

import { task, color } from '../../../task';

import './Preview.css';

const PreviewComponent: React.FC<ISocketContext> = () => (
  <div className='preview'>
    <div
      className='html-viewer box-glitchy-white'
      style={{backgroundColor: color, backgroundImage: `url(${task})`}}
    />
    <div className='scores'>
      <Timer />
    </div>
  </div>
);

export const Preview = withSocket(PreviewComponent);
