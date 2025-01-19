import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/CreateaccountAPI'; 
import './CSS/CreateAccount.css';

function CreateAccount() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    age: '',
    admin: false,
    MotDePasse: '',
    confirmMotDePasse: '',
    pseudo: '',
    couleur: '',
    Devise: '',
    Pays: '',
    avatar: '',
    email: '',
    photo: '',
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (!password.split('').some((char) => char >= 'A' && char <= 'Z')) {
      errors.push('Doit inclure au moins une lettre majuscule');
    }
    if (!password.split('').some((char) => char >= 'a' && char <= 'z')) {
      errors.push('Doit inclure au moins une lettre minuscule');
    }
    if (!password.split('').some((char) => char >= '0' && char <= '9')) {
      errors.push('Doit inclure au moins un chiffre');
    }
    if (!['!', '@', '#', '$', '%', '^', '&', '*'].some((char) => password.includes(char))) {
      errors.push('Doit inclure au moins un caractère spécial');
    }
    if (password.length < 8) {
      errors.push('Doit comporter au moins 8 caractères');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = [];

    // Validation des champs requis
    Object.entries(form).forEach(([key, value]) => {
      if (value === '' || value === null) {
        currentErrors.push(`${key} est requis`);
      }
    });

    // Validation du mot de passe
    const passwordErrors = validatePassword(form.MotDePasse);
    if (passwordErrors.length > 0) {
      currentErrors.push(...passwordErrors);
    }

    // Validation que les mots de passe correspondent
    if (form.MotDePasse !== form.confirmMotDePasse) {
      currentErrors.push('Les mots de passe ne correspondent pas');
    }

    // Si des erreurs existent, les afficher et ne pas soumettre
    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      return;
    }

    // Création d'une copie du formulaire sans le champ confirmMotDePasse
    const { confirmMotDePasse, ...formWithoutConfirmPassword } = form;

    try {
      // Appel API pour créer l'utilisateur avec les données sans confirmMotDePasse
      await createUser(formWithoutConfirmPassword);
      alert('Compte créé avec succès!');
      navigate('/');  // Rediriger vers la page de connexion
    } catch (err) {
      setErrors(['Erreur lors de la création du compte. Veuillez réessayer plus tard.']);
    }
  };

  return (
    <div id="createaccount-container">
      <div id="createaccount-form">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <input
                id="nom"
                type="text"
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
              <input
                id="prenom"
                type="text"
                placeholder="Prénom"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              />
              <input
                id="pseudo"
                type="text"
                placeholder="Pseudo"
                value={form.pseudo}
                onChange={(e) => setForm({ ...form, pseudo: e.target.value })}
              />
              <input
                id="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <input
                id="couleur"
                type="text"
                placeholder="Couleur"
                value={form.couleur}
                onChange={(e) => setForm({ ...form, couleur: e.target.value })}
              />
            </div>

            <div className="form-column">
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                id="motdepasse"
                type="password"
                placeholder="Mot de passe"
                value={form.MotDePasse}
                onChange={(e) => setForm({ ...form, MotDePasse: e.target.value })}
              />
              <input
                id="confirm-motdepasse"
                type="password"
                placeholder="Confirmer mot de passe"
                value={form.confirmMotDePasse}
                onChange={(e) => setForm({ ...form, confirmMotDePasse: e.target.value })}
              />
              <input
                id="devise"
                type="text"
                placeholder="Devise"
                value={form.Devise}
                onChange={(e) => setForm({ ...form, Devise: e.target.value })}
              />
              <input
                id="pays"
                type="text"
                placeholder="Pays"
                value={form.Pays}
                onChange={(e) => setForm({ ...form, Pays: e.target.value })}
              />
            </div>
          </div>

          <input
            id="avatar"
            type="text"
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />
          <input
            id="photo"
            type="text"
            placeholder="Photo URL"
            value={form.photo}
            onChange={(e) => setForm({ ...form, photo: e.target.value })}
          />
          <button type="submit">Create Account</button>
        </form>

        {/* Affichage des erreurs */}
        {errors.length > 0 && (
          <div id="error-container">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateAccount;
