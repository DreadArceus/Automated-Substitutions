import React from 'react';

interface AddProps {}

export const Add: React.FC<AddProps> = ({}) => {
  return (
    <div className="add">
      <h2>Enter a name then click on the appropriate button</h2>
      <h4>Tip: Press enter to add another of the last type</h4>
      <input />
      <div>
        <button>Add Teacher</button>
        <button>Add Class</button>
        <button>Add Subject</button>
      </div>
    </div>
  );
};
