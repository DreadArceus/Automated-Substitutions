import React, { useEffect, useState } from 'react';

interface ValidateProps {}

export const Validate: React.FC<ValidateProps> = ({}) => {
  const [issues, setIssues] = useState<string[] | undefined>();

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('validateTimetable')
      .then((res) => setIssues(res));
  }, []);

  return (
    <div className="validate">
      <h1>Validation Result</h1>
      <div>
        {issues === undefined ? (
          <h2>No Issues!</h2>
        ) : (
          issues.map((res) => (
            <div>
              <p>---&gt;</p> {res}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
