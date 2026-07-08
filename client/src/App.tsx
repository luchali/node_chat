import React, { useEffect, useState } from 'react';
import './App.css';
import { MessageForm } from './components/MessageForm.js';
import { MessageList } from './components/MessageList.js';
import { Message } from './types/message';
import { getMessages } from './api.js';

interface Props {
  onData: (data: Message[]) => void;
}

const DataLoader: React.FC<Props> = ({ onData }) => {
  useEffect(() => {
    getMessages().then(onData);
  });

  return <h1 className="title">Chat application</h1>;
};

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  function saveData(messages: Message[]) {
    setMessages(messages);
  }

  return (
    <section className="section content">
      <DataLoader onData={saveData} />

      <MessageForm />
      <MessageList messages={messages} />
    </section>
  );
}
