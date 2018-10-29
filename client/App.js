import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import io from 'socket.io-client';
import styles from './App.css';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UserForm from './UserForm';
import UsersList from './UsersList'; 

const socket = io('/');

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      messages: [],
      text: '',
      name: ''
    };
  }

  componentDidMount() {
    socket.on('message', message => this.messageReceive(message));
    socket.on('update', ({users}) => this.chatUpdate(users));
  }

  messageReceive(message) {
    const messages = [message, ...this.state.messages];
    this.setState({messages});
  }

  chatUpdate(users) {
    this.setState({users});
  }

  handleMessageSubmit(message) {
    const messages = [message, ...this.state.messages];
    this.setState({messages});
    socket.emit('message', message);
  }

  handleUserSubmit(name) {
    this.setState({name});
    socket.emit('join', name);
  }

  render() {
    return this.state.name !== '' ? this.renderLayout() : this.renderUserForm();
  }

  renderLayout() {
    return (
      <div className={styles.app}>
        <div className={styles.app__header}>
          <div className={styles.app__title}>
            Chat
          </div>
          <div className={styles.app__body}>
            <UsersList users={this.state.users}/>
          </div>
          <div className={styles.message__wrapper}>
            <MessageList messages={this.state.messages}/>
            <MessageForm
              onMessageSubmit={message => this.handleMessageSubmit(message)}
              name={this.state.name}/>
          </div>
        </div>
      </div>
    );
  }

  renderUserForm() {
    return (
      <UserForm onUserSubmit={name => this.handleUserSubmit(name)}/>
    );
  }
}

export default hot(module)(App);