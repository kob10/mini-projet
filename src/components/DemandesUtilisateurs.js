import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DemandesUtilisateurs = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
// Fonction pour vérifier si les données sont bien formatées
const verifyRequestData = (data) => {
  if (!data) {
    console.error('Aucune donnée reçue.');
    return false;
  }
  if (!Array.isArray(data)) {
    console.error('Les données ne sont pas un tableau.');
    return false;
  }
  return true;
};
  // Récupérer tous les utilisateurs avec leurs demandes
  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire');

      if (!verifyRequestData(response.data)) {
        setError('Données mal formatées.');
        setLoading(false);
        return;
      }

      // Collecter toutes les demandes de tous les utilisateurs
      const toutesLesDemandes = response.data.reduce((acc, utilisateur) => {
        if (utilisateur.requests && Array.isArray(utilisateur.requests)) {
          utilisateur.requests.forEach((demande, index) => {
            if (demande && demande.status !== undefined) {
              acc.push({
                ...demande,
                utilisateurId: utilisateur.id,
                nomUtilisateur: utilisateur.nom || utilisateur.username || 'Utilisateur',
                status: demande.status || 'En attente' 
              });
            }
          });
        }

        return acc;
      }, []);

      setDemandes(toutesLesDemandes);
      setLoading(false);
    } catch (err) {
      setError('Impossible de charger les demandes');
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'une demande
  const updateDemandeStatus = async (utilisateurId, demandeIndex, nouveauStatut) => {
    try {
      // Récupérer l'utilisateur actuel
      const utilisateurResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`);
      const utilisateur = utilisateurResponse.data;

      // Mettre à jour le statut de la demande
      if (utilisateur.requests) {
        utilisateur.requests[demandeIndex].status = nouveauStatut;

        // Mettre à jour l'utilisateur
        await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`, utilisateur);

        // Mettre à jour l'état local
        fetchDemandes();
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Supprimer une demande
  const supprimerDemande = async (utilisateurId, demandeIndex) => {
    try {
      // Récupérer l'utilisateur actuel
      const utilisateurResponse = await axios.get(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`);
      const utilisateur = utilisateurResponse.data;

      // Supprimer la demande
      if (utilisateur.requests) {
        utilisateur.requests.splice(demandeIndex, 1);

        // Mettre à jour l'utilisateur
        await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${utilisateurId}`, utilisateur);

        // Mettre à jour l'état local
        fetchDemandes();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la demande:', err);
      alert('Erreur lors de la suppression de la demande');
    }
  };

  // Charger les demandes au montage uniquement si l'utilisateur est admin
  useEffect(() => {
    if (user?.admin) {
      fetchDemandes();
    }
  }, [user]);

  // Si l'utilisateur n'est pas admin, ne rien render
  if (!user?.admin) {
    return <div>Vous n'avez pas les droits pour voir cette page.</div>;
  }

  // Afficher un message de chargement
  if (loading) {
    return <div>Chargement des demandes...</div>;
  }

  // Afficher un message d'erreur
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="demandes-container">
      <h2>Demandes des Utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>Titre de la Demande</th>
            <th>Utilisateur</th>
            <th>Statut Actuel</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((demande, index) => (
            <tr key={`${demande.utilisateurId}-${index}`}>
              <td>{demande.title}</td>
              <td>{demande.nomUtilisateur}</td>
              <td>{demande.status}</td>
              <td>
                <div className="actions-buttons">
                  <button 
                    onClick={() => {
                      // Logique pour afficher la demande en détail
                      alert(`Détails de la demande:\n\nTitre: ${demande.title}\n\nDescription: ${demande.description}`);
                    }}
                  >
                    Afficher
                  </button>
                  <button 
                    onClick={() => updateDemandeStatus(demande.utilisateurId, index, 'En attente')}
                    disabled={demande.status === 'En attente'}
                  >
                    Mettre en Attente
                  </button>
                  <button 
                    onClick={() => updateDemandeStatus(demande.utilisateurId, index, 'Approuvée')}
                    disabled={demande.status === 'Approuvée'}
                  >
                    Approuver
                  </button>
                  <button 
                    onClick={() => supprimerDemande(demande.utilisateurId, index)}
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {demandes.length === 0 && <p>Aucune demande trouvée.</p>}
    </div>
  );
};

export default DemandesUtilisateurs;