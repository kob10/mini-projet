import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/actions';
import { useNavigate } from 'react-router-dom';
import './CSS/header.css'; 

const Header = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout triggered');
    dispatch(logout());
    navigate('/login');
  };
  

  return (
    <header id="header">
      <div className="user-info">
        {user && (
          <>
            <img 
              src={user.avatar} 
              alt="User Avatar" 
              className="avatar" 
            />
            <span>{user.nom} {user.prenom}</span>
          </>
        )}
      </div>
      <button id="logout-button" onClick={handleLogout}>Déconnexion</button>
    </header>
  );
};

export default Header;
