import { useState } from 'react';
import { sendMessage } from '../api';

interface Props {
  onMessageSent: () => void;
}

export const MessageForm = ({ onMessageSent }: Props) => {
  const [text, setText] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!text) return;
     const author = localStorage.getItem('username') ?? 'Anonymous';

    await sendMessage(text, author);
    setText('');
    onMessageSent();
  }

  return (
    <form className="field is-horizontal" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        placeholder="Enter a message"
        value={text}
        onChange={event => setText(event.target.value)}
      />
      <button className="button">Send</button>
    </form>
  );
};
