import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '/react/mini-projet-react/src/store/actions'; 
import { verifyLogin } from '../api/LoginAPI'; 
import { useNavigate } from 'react-router-dom';
import './CSS/Login.css';
import { addLog } from '../redux/trackingReducer';

const MAX_TENTATIVES = 3;

const Login = () => {
  const dispatch = useDispatch();
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState([]);
  const [tentatives, setTentatives] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    // Appel à l'API pour vérifier les identifiants
    const result = await verifyLogin(nom, motDePasse);

    if (result.success) {
      dispatch(addLog({
        user: result.user.nom,
        action: 'Logged in',
        timestamp: new Date().toISOString(),
      }));
      // Connexion réussie, stockage du jeton dans localStorage
      localStorage.setItem('token', result.token); // Stocker le jeton dans localStorage
      dispatch(loginSuccess(result.user));

      setMessage(['Connexion réussie ! Bienvenue ' + result.user.prenom + '.']);
      setTentatives(0);

      // Rediriger vers une autre page (par exemple le dashboard ou le layout)
      navigate('/Layout');
    } else {
      const newTentatives = tentatives + 1;
      setTentatives(newTentatives);
      const tentativesRestantes = MAX_TENTATIVES - newTentatives;
      if (newTentatives >= MAX_TENTATIVES) {
        setIsDisabled(true);
        setMessage(['Compte bloqué après 3 tentatives échouées.']);
      } else {
        setMessage([
          'Connexion incorrecte.',
          `Tentatives restantes : ${tentativesRestantes}`
        ]);
      }
    }
  };

  return (
    <div id="login-container">
      <form id="login-form" onSubmit={handleLogin}>
        <h1>Connexion</h1>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            disabled={isDisabled}
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            disabled={isDisabled}
          />
        </div>
        <button id="login-button" type="submit" disabled={isDisabled}>LOGIN</button>
        <div className="error-block">
          {message.length > 0 && (
            <ul>
              {message.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
        <p>
          <a href="/CreateAccount">Create an account</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
