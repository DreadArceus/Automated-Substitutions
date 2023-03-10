import React from 'react';
import { Link } from 'react-router-dom';
import home from '../../../assets/home.png';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <div className="header">
      <Link to={'/'}>
        <img src={home} />
      </Link>
    </div>
  );
};
