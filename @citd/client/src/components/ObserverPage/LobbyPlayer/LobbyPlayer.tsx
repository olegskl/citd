import { Player } from '@citd/shared';
import * as React from 'react';
import Avatar from 'avataaars'

import './LobbyPlayer.css';

interface LobbyPlayerProps {
  player: Player | undefined;
  namePlaceholder: string;
  onPlayerKick: (playerId: string) => void;
}

export class LobbyPlayer extends React.PureComponent<LobbyPlayerProps> {

  private kickPlayer = () => {
    if (this.props.player) {
      this.props.onPlayerKick(this.props.player.id);
    }
  }

  render() {
    if (!this.props.player) {
      return (
        <div className='lobby-player'>
          <div className='lobby-player-avatar box-glitchy-red' />
          <div className='lobby-player-nickname text-glitchy-medium'>
            {this.props.namePlaceholder}
          </div>
        </div>
      );
    }
    return (
      <div className='lobby-player'>
        <div className='lobby-player-avatar box-glitchy-red' onClick={this.kickPlayer}>
          <Avatar
            style={{width: '30vh', height: '30vh'}}
            avatarStyle='Transparent'
            topType='LongHairMiaWallace'
            accessoriesType='Prescription02'
            hairColor='BrownDark'
            facialHairType='Blank'
            clotheType='Hoodie'
            clotheColor='PastelBlue'
            eyeType='Happy'
            eyebrowType='Default'
            mouthType='Smile'
            skinColor='Light'
          />
        </div>
        <div className='lobby-player-nickname text-glitchy-medium'>
          {this.props.player.name}
        </div>
      </div>
    );
  }
}
