import React, { useEffect, useState } from 'react';

interface EditTTProps {}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const EditTT: React.FC<EditTTProps> = ({}) => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [selectedT, setSelectedT] = useState<number>(-1);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedC, setSelectedC] = useState<number>(-1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedS, setSelectedS] = useState<number>(-1);
  const [matrix, setMatrix] = useState<number[][] | undefined>();

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getT').then((res) => {
      setTeachers(res);
    });
    window.electron.ipcRenderer.invoke('getC').then((res) => {
      setClasses(res);
    });
    window.electron.ipcRenderer.invoke('getS').then((res) => {
      setSubjects(res);
    });
  }, []);

  const handleGet = () => {
    const temp = [];
    for (var j = 0; j < 6; j++) {
      const ar = [];
      for (var i = 0; i < 9; i++) ar.push(Math.floor(Math.random() * 2));
      temp.push(ar);
    }
    setMatrix(temp);
  };

  const handleToggle = (day: number, period: number) => {
    if (!matrix) return;

    setMatrix([
      ...matrix.slice(0, day),
      [
        ...matrix[day].slice(0, period),
        matrix[day][period] ? 0 : 1,
        ...matrix[day].slice(period + 1),
      ],
      ...matrix.slice(day + 1),
    ]);
  };

  const handleUpdate = () => {};

  return (
    <div className="edit-tt">
      <div>
        <div id="left-menu">
          <select
            value={selectedT}
            onChange={(e) => setSelectedT(parseInt(e.target.value))}
          >
            <option value="-1" hidden>
              Choose Teacher
            </option>
            {teachers.map((val, id) => (
              <option value={id}>{val}</option>
            ))}
          </select>
          <select
            value={selectedC}
            onChange={(e) => setSelectedC(parseInt(e.target.value))}
          >
            <option value="-1" hidden>
              Choose Class
            </option>
            {classes.map((val, id) => (
              <option value={id}>{val}</option>
            ))}
          </select>
          <select
            value={selectedS}
            onChange={(e) => setSelectedS(parseInt(e.target.value))}
          >
            <option value="-1" hidden>
              Choose Subject
            </option>
            {subjects.map((val, id) => (
              <option value={id}>{val}</option>
            ))}
          </select>
          <button onClick={handleGet}>Get</button>
        </div>
        {matrix === undefined ? (
          <h2>Select the Teacher-Class-Subject you want to edit</h2>
        ) : (
          <div id="edit-box">
            <div>
              <h4>P&D</h4>
              {Array(9)
                .fill(1)
                .map((_, id) => (
                  <h3>{id}</h3>
                ))}
            </div>
            {matrix.map((dayVector, day) => (
              <div>
                <h4>{dayNames[day]}</h4>
                {dayVector.map((active, period) => (
                  <div
                    style={{ backgroundColor: active ? 'green' : 'black' }}
                    onClick={() => handleToggle(day, period)}
                  ></div>
                ))}
              </div>
            ))}
            <div>
              <button onClick={handleUpdate}>Update</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
