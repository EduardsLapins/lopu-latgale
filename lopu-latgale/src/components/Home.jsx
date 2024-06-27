
import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [, setCookie] = useCookies(['team']);
    const navigate = useNavigate();
  
    const handleSelectTeam = (team) => {
      setCookie('team', team, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      navigate(`/${team}`);
    };
  
    return (
      <div >
        <h1>Izvēlies savu komandu</h1>
            <div className="container">
            <button onClick={() => handleSelectTeam('Beka_Beha')}>Beķa Beha</button>
                <button onClick={() => handleSelectTeam('Karla_Kariete')}>Kārļa Kariete</button>
                <button onClick={() => handleSelectTeam('Ievas_Jetta')}>Ievas Jetta</button>
            </div>
      </div>
    );
};

export default Home;
