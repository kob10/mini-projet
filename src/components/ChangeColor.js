import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeColor } from '../store/actions';
import { updateColorAPI } from '../api/UserAPI';
import './CSS/ChangeColor.css';

const ChangeColor = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [newColor, setNewColor] = useState(user?.couleur || '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (user) {
      if (user?.age < 15 && !user?.admin) {
        setMessage("Vous devez être administrateur ou avoir plus de 15 ans pour changer votre couleur.");
        setMessageType('error');
      } else {
        setMessage('');
        setMessageType('');
      }
    }
  }, [user]);

  const handleChangeColor = async () => {
    if (!user || (user?.age < 15 && !user?.admin)) {
      setMessage("Vous n'êtes pas autorisé à changer la couleur.");
      setMessageType('error');
      return;
    }

    try {
      if (!user?.id) {
        throw new Error('Utilisateur non identifié');
      }

      const updatedUser = await updateColorAPI(user.id, newColor);
      dispatch(changeColor(updatedUser.couleur));
      setMessage('Couleur mise à jour avec succès!');
      setMessageType('success');
    } catch (error) {
      console.error('Error while updating color:', error);
      if (error.response && error.response.status === 401) {
        setMessage('Votre session a expiré. Veuillez vous reconnecter.');
        setMessageType('error');
      } else {
        setMessage('Erreur lors de la mise à jour de la couleur.');
        setMessageType('error');
      }
    }
  };

  if (!user || (user?.age < 15 && !user?.admin)) {
    return <div className="message error">{message}</div>;
  }

  return (
    <div
      id="changeColor-container"
      style={{ backgroundColor: newColor || '#fff', transition: 'background-color 0.5s ease', important: 'true' }}

    >
      <h2>Modifier la couleur de votre profil</h2>
      <p>
        Couleur actuelle :
        <span style={{ color: user?.couleur, fontWeight: 'bold', fontSize: '18px' }}>
          {user?.couleur}
        </span>
      </p>

      <div>
        <label htmlFor="colorSelect">Choisissez une nouvelle couleur :</label>
        <select
          id="colorSelect"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        >
          <option value="">-- Sélectionner une couleur --</option>
          <option value="blue">Bleu</option>
          <option value="green">Vert</option>
          <option value="red">Rouge</option>
          <option value="yellow">Jaune</option>
          <option value="gray">gray</option>
          <option value="pink">pink</option>
          <option value="black">black</option>
          <option value="brown">Brown</option>
          <option value="purple">purple</option>
        </select>
      </div>

      <button onClick={handleChangeColor}>Valider</button>

      {message && (
        <p className={`message ${messageType}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ChangeColor;
