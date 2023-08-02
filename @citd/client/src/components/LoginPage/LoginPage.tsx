import * as React from 'react';
import { Link } from 'react-router-dom';
import { useGameContext } from '../../context/game';

import './LoginPage.css';

const LoginPageComponent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { player, dispatch } = useGameContext();
  const [name, setName] = React.useState<string>('');

  const onLogin = React.useCallback(() => {
    if (!name) return;
    dispatch({ type: 'joinGame' });
    dispatch({ type: 'changeName', payload: name });
  }, [dispatch, name]);

  React.useEffect(() => {
    if (player) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.which === 13) {
        // enter
        onLogin();
      } else if (e.which === 8) {
        // backspace
        setName(name.slice(0, -1));
      } else if (/[a-z0-9\- ]/i.test(String.fromCharCode(e.which))) {
        setName(name.length < 10 ? name + e.key : name);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onLogin, name, player]);

  // Player loading state:
  if (player) {
    return <>{children}</>;
  }

  return (
    <div className="login-page">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      <div className="text-glitchy-medium">What&apos;s your name?</div>
      <div className="nickname">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className={'nickname-letter' + (name.length === i ? ' active' : '')}>
            {name[i] || ''}
          </div>
        ))}
      </div>
      <div className="welcome-buttons">
        <Link to="/" className="button-glitchy-yellow">
          Leave
        </Link>
        <button onClick={onLogin} className="button-glitchy-yellow">
          Enter the Dark
        </button>
      </div>
    </div>
  );
};

export const LoginPage = LoginPageComponent;
