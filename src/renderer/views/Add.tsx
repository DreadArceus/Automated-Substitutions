import { Channels } from 'main/preload';
import React, { useState } from 'react';

interface AddProps {}

export const Add: React.FC<AddProps> = ({}) => {
  const [name, setName] = useState('');
  const [last, setLast] = useState('');

  const handleClick = (kind: string) => {
    window.electron.ipcRenderer.sendMessage(('add' + kind) as Channels, [name]);
    setName('');
    setLast(kind);
  };

  return (
    <div className="add">
      <h2>Enter a name then click on the appropriate button</h2>
      <h4>Tip: Press enter to add another of the last type</h4>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && last !== '') handleClick(last);
        }}
      />
      <div>
        <button onClick={() => handleClick('T')}>Add Teacher</button>
        <button onClick={() => handleClick('C')}>Add Class</button>
        <button onClick={() => handleClick('S')}>Add Subject</button>
      </div>
    </div>
  );
};
