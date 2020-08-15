import * as React from 'react';

import { ISocketContext, withSocket } from '../../context/socket';

import './LoginPage.css';

const LoginPageComponent: React.FC<ISocketContext> = ({ socket }) => {
  const [nickname, setNickname] = React.useState<string>('');

  const onCreateUser = React.useCallback(() => {
    if (!nickname) {
      return;
    }

    socket.emit('createUser', nickname);
  }, [nickname, socket]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.which === 13) {
        // enter
        onCreateUser();
      } else if (e.which === 8) {
        // backspace
        setNickname(nickname.slice(0, -1));
      } else if (/[a-z0-9\- ]/i.test(String.fromCharCode(e.which))) {
        setNickname(nickname.length < 10 ? nickname + e.key : nickname);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onCreateUser]);

  return (
    <div className="login-page">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      <div className="text-glitchy-medium">What&apos;s your name?</div>
      <div className="nickname">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className={'nickname-letter' + (nickname.length === i ? ' active' : '')}>
            {nickname[i] || ''}
          </div>
        ))}
      </div>
      <button onClick={onCreateUser} className="button-glitchy-yellow">
        Enter the Dark
      </button>
    </div>
  );
};

export const LoginPage = withSocket(LoginPageComponent);
