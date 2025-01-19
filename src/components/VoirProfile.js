import React from 'react';
import { useSelector } from 'react-redux';
import './CSS/Profile.css';

const VoirProfile = () => {
  const user = useSelector((state) => state.auth.user);  
  if (!user) {
    return <div>Utilisateur non connecté</div>;
  }

  return (
    <div id="profile-container">
      <h2>Profil de {user.nom} {user.prenom}</h2>
      <form>
        <div className="profile-field">
          <label>Nom:</label>
          <input type="text" value={user.nom} readOnly />
        </div>
        <div className="profile-field">
          <label>Prénom:</label>
          <input type="text" value={user.prenom} readOnly />
        </div>
        <div className="profile-field">
          <label>Pseudo:</label>
          <input type="text" value={user.pseudo} readOnly />
        </div>
        <div className="profile-field">
          <label>Age:</label>
          <input type="number" value={user.age} readOnly />
        </div>
        <div className="profile-field">
          <label>Couleur préférée:</label>
          <input type="text" value={user.couleur} readOnly />
        </div>
        <div className="profile-field">
          <label>Devise:</label>
          <input type="text" value={user.Devise} readOnly />
        </div>
        <div className="profile-field">
          <label>Pays:</label>
          <input type="text" value={user.Pays} readOnly />
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <input type="email" value={user.email} readOnly />
        </div>
      </form>
    </div>
  );
};

export default VoirProfile;
