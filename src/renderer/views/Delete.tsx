import { Channels } from 'main/preload';
import React, { useEffect, useState } from 'react';

interface DeleteProps {}

export const Delete: React.FC<DeleteProps> = ({}) => {
  const [kind, setKind] = useState('T');
  const [list, setList] = useState<string[]>([]);
  const [toDelete, setToDelete] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke(('get' + kind) as Channels)
      .then((res) => {
        setToDelete(''), setList(res);
      });
  }, [kind]);

  const handleDelete = () => {
    if (toDelete === '') return;
    window.electron.ipcRenderer.send(('delete' + kind) as Channels, [toDelete]);
    setToDelete('');
    setList(list.filter((val) => val !== toDelete));
  };

  return (
    <div className="delete">
      <h2>Choose what to delete and press delete</h2>
      <div>
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="T">Teacher</option>
          <option value="C">Class</option>
          <option value="S">Subject</option>
        </select>
        <select
          id="del"
          value={toDelete}
          onChange={(e) => setToDelete(e.target.value)}
        >
          <option value="" hidden>
            Choose
          </option>
          {list.map((val) => (
            <option>{val}</option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};
