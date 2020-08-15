import { Player } from '@citd/shared';
import * as React from 'react';
import Avatar from 'avataaars';

import './LobbyPlayer.css';

type LobbyPlayerProps = {
  player: Player | undefined;
  namePlaceholder: string;
  onPlayerKick: (playerId: string) => void;
};

const LobbyPlayerComponent: React.FC<LobbyPlayerProps> = ({
  player,
  namePlaceholder,
  onPlayerKick,
}) => {
  const kickPlayer = () => {
    if (player) {
      onPlayerKick(player.id);
    }
  };

  if (!player) {
    return (
      <div className="lobby-player">
        <div className="lobby-player-avatar box-glitchy-red" />
        <div className="lobby-player-nickname text-glitchy-medium">{namePlaceholder}</div>
      </div>
    );
  }

  return (
    <div className="lobby-player">
      <div className="lobby-player-avatar box-glitchy-red" onClick={kickPlayer}>
        <Avatar
          style={{ width: '30vh', height: '30vh' }}
          avatarStyle="Transparent"
          topType="LongHairMiaWallace"
          accessoriesType="Prescription02"
          hairColor="BrownDark"
          facialHairType="Blank"
          clotheType="Hoodie"
          clotheColor="PastelBlue"
          eyeType="Happy"
          eyebrowType="Default"
          mouthType="Smile"
          skinColor="Light"
        />
      </div>
      <div className="lobby-player-nickname text-glitchy-medium">{player.name}</div>
    </div>
  );
};

export const LobbyPlayer = React.memo(LobbyPlayerComponent);
