import { Channels } from 'main/preload';
import React, { useState } from 'react';

interface AddProps {}

export const Add: React.FC<AddProps> = ({}) => {
  const [name, setName] = useState('');
  const [last, setLast] = useState('');

  const handleAdd = (kind: string) => {
    if (name === '') return;
    window.electron.ipcRenderer.send(('add' + kind) as Channels, [name]);
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
          if (e.key === 'Enter' && last !== '') handleAdd(last);
        }}
      />
      <div>
        <button onClick={() => handleAdd('T')}>Add Teacher</button>
        <button onClick={() => handleAdd('C')}>Add Class</button>
        <button onClick={() => handleAdd('S')}>Add Subject</button>
      </div>
    </div>
  );
};
