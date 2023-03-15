import React, { useEffect, useState } from 'react';

interface EditTTProps {}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const EditTT: React.FC<EditTTProps> = ({}) => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [selectedT, setSelectedT] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedC, setSelectedC] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedS, setSelectedS] = useState('');
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
    if (selectedT === '' || selectedC === '' || selectedS === '') return;
    window.electron.ipcRenderer
      .invoke('getTCSEntries', [selectedT, selectedC, selectedS])
      .then((res) => {
        setMatrix(res);
      });
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

  const handleUpdate = () => {
    window.electron.ipcRenderer.send('updateTimetable', [
      selectedT,
      selectedC,
      selectedS,
      matrix,
    ]);
  };

  return (
    <div className="edit-tt">
      <div>
        <div id="left-menu">
          <select
            value={selectedT}
            onChange={(e) => {
              setSelectedT(e.target.value);
              setMatrix(undefined);
            }}
          >
            <option value="" hidden>
              Choose Teacher
            </option>
            {teachers.map((val) => (
              <option>{val}</option>
            ))}
          </select>
          <select
            value={selectedC}
            onChange={(e) => {
              setSelectedC(e.target.value);
              setMatrix(undefined);
            }}
          >
            <option value="" hidden>
              Choose Class
            </option>
            {classes.map((val) => (
              <option>{val}</option>
            ))}
          </select>
          <select
            value={selectedS}
            onChange={(e) => {
              setSelectedS(e.target.value);
              setMatrix(undefined);
            }}
          >
            <option value="" hidden>
              Choose Subject
            </option>
            {subjects.map((val) => (
              <option>{val}</option>
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
