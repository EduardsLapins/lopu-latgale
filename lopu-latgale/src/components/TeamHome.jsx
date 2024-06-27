// src/components/TeamHome.js
import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const TeamHome = () => {
  const [cookies] = useCookies(['team']);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  let team = cookies.team.replace('_', ' ');



  if (team === 'Beka Beha') {
    team = 'Beķa Beha';
  }
  else if (team === 'Karla Kariete') {
    team = 'Kārļa Kariete';
  }
  else if (team === 'Ievas Jetta') {
    team = 'Ievas Jetta';
  }

  return (
    <div>
      <h1>{team}</h1>
      <div className='container'>
        <button onClick={() => handleNavigation(`/${cookies.team}/uzdevumi`)}>Uzdevumi</button>
        <button onClick={() => handleNavigation(`/${cookies.team}/karte`)}>Karte</button>
      </div>
    </div>
  );
};

export default TeamHome;
