import * as React from 'react';

import { ISocketContext, withSocket } from '../../context/socket';

import './LoginPage.css';

interface LoginPageState {
  nickname: string;
}

class LoginPageComponent extends React.PureComponent<ISocketContext, LoginPageState> {
  state: LoginPageState = {
    nickname: ''
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.which === 13) { // enter
      this.onCreateUser();
    } else if (e.which === 8) { // backspace
      this.setState(({nickname}) => ({
        nickname: nickname.slice(0, -1)}
      ));
    } else if (/[a-z0-9\- ]/i.test(String.fromCharCode(e.which))) {
      this.setState(({nickname}) => ({
        nickname: nickname.length < 10 ? nickname + e.key : nickname}
      ));
    }
  }

  private onCreateUser = () => {
    if (!this.state.nickname) { return; }
    this.props.socket.emit('createUser', this.state.nickname);
  }

  render() {
    const {nickname} = this.state;
    return (
      <div className='login-page'>
        <h1 className='text-glitchy-large'>Code in the Dark</h1>
        <div className='text-glitchy-medium'>What's your name?</div>
        <div className='nickname'>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div key={i} className={'nickname-letter' + (nickname.length === i ? ' active' : '')}>
              {nickname[i] || ''}
            </div>
          ))}
        </div>
        <button onClick={this.onCreateUser} className='button-glitchy-yellow'>
          Enter the Dark
        </button>
      </div>
    );
  }
};

export const LoginPage = withSocket(LoginPageComponent);
