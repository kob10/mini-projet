import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Accueil = () => {
  const user = useSelector((state) => state.auth.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRequests, setUserRequests] = useState([]);

  // Charger les demandes de l'utilisateur au montage du composant
  useEffect(() => {
    if (user) {
      fetchUserRequests();
    }
  }, [user]);

  // Récupérer les demandes de l'utilisateur
  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`);
      // Assurez-vous que la structure correspond à votre API
      setUserRequests(response.data.requests || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  };

  // Vérifier si l'utilisateur est connecté
  if (!user) {
    return <div>Veuillez vous connecter pour soumettre une demande.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    setIsSubmitting(true);

    // Nouvelle demande
    const newRequest = {
      title,
      description,
      status: 'En attente',
      createdAt: new Date().toISOString()
    };

    try {
      // Récupérer l'utilisateur actuel
      const userResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`);
      const currentUser = userResponse.data;

      // Ajouter la nouvelle demande
      const updatedRequests = currentUser.requests 
        ? [...currentUser.requests, newRequest] 
        : [newRequest];

      // Mettre à jour l'utilisateur avec les nouvelles demandes
      await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`, {
        ...currentUser,
        requests: updatedRequests
      });

      // Mettre à jour l'état local
      setUserRequests(updatedRequests);

      // Réinitialiser le formulaire
      setMessage('Votre demande a été soumise avec succès.');
      setTitle('');
      setDescription('');
    } catch (error) {
      setMessage('Erreur lors de l\'envoi de la demande. Veuillez réessayer plus tard.');
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer une demande
  const handleDeleteRequest = async (requestIndex) => {
    try {
      // Récupérer l'utilisateur actuel
      const userResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`);
      const currentUser = userResponse.data;

      // Supprimer la demande spécifique
      const updatedRequests = currentUser.requests.filter((_, index) => index !== requestIndex);

      // Mettre à jour l'utilisateur avec les demandes mises à jour
      await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${user.id}`, {
        ...currentUser,
        requests: updatedRequests
      });

      // Mettre à jour l'état local
      setUserRequests(updatedRequests);
      setMessage('Demande supprimée avec succès.');
    } catch (error) {
      setMessage('Erreur lors de la suppression de la demande.');
      console.error('Erreur:', error);
    }
  };

  return (
    <div id="accueil-page">
      <h2>Bienvenue sur la page d'accueil !</h2>
      <p>Cette page est l'endroit où vous pouvez soumettre et gérer vos demandes.</p>
      
      <h3>Faire une demande</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre de votre demande"
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre demande"
            required
          ></textarea>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h3>Vos demandes</h3>
      {userRequests.length === 0 ? (
        <p>Vous n'avez pas encore de demandes.</p>
      ) : (
        <ul>
          {userRequests.map((request, index) => (
            <li key={index}>
              <strong>{request.title}</strong>
              <p>{request.description}</p>
              <p>Statut : {request.status}</p>
              <button onClick={() => handleDeleteRequest(index)}>
                Supprimer la demande
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Accueil;