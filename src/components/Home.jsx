import { useNavigate } from 'react-router-dom';
import React from 'react';
import TopItems from './TopItems';


function Home() {
    const navigate = useNavigate();

    const goToMenu = () => {
        navigate('/menu');
    };

    return (
        <div className="home-page">
        <h1>Home page</h1>
        <TopItems />

        <button 
        onClick={goToMenu}
        style={{ 
          margin: '10px', 
          padding: '10px 20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Menu
      </button>
    </div>

    
        
    );
}

export default Home;