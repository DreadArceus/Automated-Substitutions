import React, { useEffect, useState } from 'react';

interface SubsProps {}

export const Subs: React.FC<SubsProps> = ({}) => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [absentees, setAbsentees] = useState<string[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getT').then((res) => setTeachers(res));
  }, []);

  return (
    <div className="subs">
      <h1>Substitutions</h1>
      <select
        value={selected}
        onChange={(e) => {
          setAbsentees([...absentees, e.target.value]);
          setSelected(' ');
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
            <div onClick={() => setAbsentees(absentees.filter((a) => a != t))}>
              X
            </div>
          </div>
        ))}
      </div>
      <button>Get Substitutions</button>
    </div>
  );
};
