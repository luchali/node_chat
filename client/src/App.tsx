import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { MessageForm } from './components/MessageForm.js';
import { MessageList } from './components/MessageList.js';
import { Message } from './types/message';
import { getMessages } from './api.js';
import { WebSocketLoader } from './dataLoader/index.js';
import { UserNameForm } from './components/UserNameForm.js';

// interface Props {
//   onData: (data: Message[]) => void;
// }

// const DataLoader: React.FC<Props> = ({ onData }) => {
//   useEffect(() => {
//     getMessages().then(onData);
//   });

//   return <h1 className="title">Chat application</h1>;
// };

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState(
    localStorage.getItem('username') ?? '',
  );
  async function loadMessages() {
    const messagesFromServer = await getMessages();

    setMessages(messagesFromServer);
  }

  const addMessage = useCallback((message: Message) => {
    setMessages(currentMessages => {
      const alreadyExists = currentMessages.some(
        currentMessage => currentMessage.time === message.time,
      );

      if (alreadyExists) {
        return currentMessages;
      }

      return [...currentMessages, message];
    });
  }, []);

  useEffect(() => {
    if (username) {
      loadMessages();
    }
  }, [username]);

  if (!username) {
    return (
      <section className="section content">
        <h1 className="title">Chat application</h1>
        <h2 className="subtitle">Enter your username</h2>

        <UserNameForm onUsernameSaved={setUsername} />
      </section>
    );
  }

  return (
    <section className="section content">
      <h1 className="title">Chat application</h1>
      <p>
        Your username: <strong>{username}</strong>
      </p>

      <WebSocketLoader onMessage={addMessage} />
      <MessageForm username={username} onMessageSent={loadMessages} />
      <MessageList messages={messages} />
    </section>
  );
}
