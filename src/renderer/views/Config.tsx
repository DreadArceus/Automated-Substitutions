import React, { useEffect, useState } from 'react';

interface ConfigProps {}

export const Config: React.FC<ConfigProps> = ({}) => {
  const [periods, setPeriods] = useState(0);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('getConfig').then((res) => {
      setPeriods(res.periods);
    });
  }, []);

  const handleSave = () => {
    window.electron.ipcRenderer.send('updateConfig', [{ periods }]);
  };

  return (
    <div className="config">
      <h1>Configure Timetable</h1>
      <div>
        <h3>Number of periods in a day:</h3>
        <input
          value={periods || ''}
          onChange={(e) => {
            setPeriods(parseInt(e.target.value) || 0);
          }}
        />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};
