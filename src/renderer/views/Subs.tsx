import { dayNames } from '../util';
import React, { useEffect, useState } from 'react';

interface SubsProps {}

export const Subs: React.FC<SubsProps> = ({}) => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [day, setDay] = useState(0);
  const [absentees, setAbsentees] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getT').then((res) => setTeachers(res));
  }, []);

  const handleGet = () => {
    window.electron.ipcRenderer
      .invoke('getSubs', [absentees, excluded, day])
      .then((res) => console.log(res));
  };

  return (
    <div className="subs">
      <h1>Substitutions</h1>
      <div id="sub-teachers">
        <div>
          <select
            value={''}
            onChange={(e) => {
              setAbsentees([...absentees, e.target.value]);
            }}
          >
            <option value="" hidden>
              Choose Absent Teacher
            </option>
            {teachers
              .filter((t) => !absentees.includes(t))
              .map((val) => (
                <option>{val}</option>
              ))}
          </select>
          <div>
            {absentees.map((t) => (
              <div>
                {t}
                <div
                  onClick={() => setAbsentees(absentees.filter((a) => a != t))}
                >
                  X
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <select
            value={''}
            onChange={(e) => {
              setExcluded([...excluded, e.target.value]);
            }}
          >
            <option value="" hidden>
              Choose Excluded Teacher
            </option>
            {teachers
              .filter((t) => !excluded.includes(t))
              .map((val) => (
                <option>{val}</option>
              ))}
          </select>
          <div>
            {excluded.map((t) => (
              <div>
                {t}
                <div
                  onClick={() => setExcluded(excluded.filter((e) => e != t))}
                >
                  X
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="sub-end">
        <select value={day} onChange={(e) => setDay(parseInt(e.target.value))}>
          {dayNames.map((name, id) => (
            <option value={id}>{name}</option>
          ))}
        </select>
        <button onClick={handleGet}>Get Substitutions</button>
      </div>
    </div>
  );
};
