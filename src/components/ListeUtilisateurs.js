import React, { useEffect, useState } from 'react';
import { fetchUsersAPI, deleteUserAPI, updateUserAPI } from '../api/UserAPI'; // Assurez-vous que le chemin est correct

const ListeUtilisateurs = () => {
  const [users, setUsers] = useState([]); // État pour stocker les utilisateurs
  const [loading, setLoading] = useState(true); // État pour savoir si les utilisateurs sont en cours de chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [isEditing, setIsEditing] = useState(false); // État pour savoir si un utilisateur est en mode édition
  const [isViewing, setIsViewing] = useState(false); // État pour savoir si un utilisateur est en mode "voir les détails"
  const [currentUser, setCurrentUser] = useState(null); // Utilisateur actuellement sélectionné pour modification ou visualisation

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsersAPI(); // Appel API pour récupérer les utilisateurs
        setUsers(usersData); // Stocker les utilisateurs dans l'état
      } catch (error) {
        setError('Erreur lors de la récupération des utilisateurs');
      } finally {
        setLoading(false); // Une fois les données chargées, désactiver le loading
      }
    };

    loadUsers(); // Appel de la fonction pour récupérer les utilisateurs
  }, []);

  // Si les données sont en cours de chargement
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si une erreur s'est produite
  if (error) {
    return <div>{error}</div>;
  }

  // Fonction pour activer le mode d'édition
  const handleEdit = (user) => {
    setIsEditing(true);
    setIsViewing(false);
    setCurrentUser({ ...user });
  };

  // Fonction pour activer le mode de visualisation des détails
  const handleViewDetails = (user) => {
    setIsViewing(true);
    setIsEditing(false);
    setCurrentUser({ ...user });
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (userId) => {
    try {
      await deleteUserAPI(userId); // Appel API pour supprimer l'utilisateur
      setUsers(users.filter(user => user.id !== userId)); // Mettre à jour l'état pour retirer l'utilisateur supprimé
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  // Fonction pour annuler la modification et revenir à la liste des utilisateurs
  const handleCancel = () => {
    setIsEditing(false);
    setIsViewing(false);
    setCurrentUser(null);
  };

  // Fonction pour valider la modification
  const handleSubmit = async () => {
    try {
      await updateUserAPI(currentUser.id, currentUser); // Appel API pour mettre à jour l'utilisateur
      setIsEditing(false);
      setIsViewing(false);
      setCurrentUser(null);
      // Recharger la liste des utilisateurs après la mise à jour
      const updatedUsers = await fetchUsersAPI();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      {isEditing || isViewing ? (
        // Formulaire de modification ou de visualisation
        <div>
          <h3>{isEditing ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'}</h3>
          <form>
            <div>
              <label>Nom:</label>
              <input
                type="text"
                value={currentUser.nom}
                onChange={(e) => setCurrentUser({ ...currentUser, nom: e.target.value })}
                disabled={!isEditing} // Si on est en mode "voir", le champ est désactivé
              />
            </div>
            <div>
              <label>Prénom:</label>
              <input
                type="text"
                value={currentUser.prenom}
                onChange={(e) => setCurrentUser({ ...currentUser, prenom: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>Âge:</label>
              <input
                type="number"
                value={currentUser.age}
                onChange={(e) => setCurrentUser({ ...currentUser, age: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>Avatar URL:</label>
              <input
                type="text"
                value={currentUser.avatar}
                onChange={(e) => setCurrentUser({ ...currentUser, avatar: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>Photo URL:</label>
              <input
                type="text"
                value={currentUser.photo}
                onChange={(e) => setCurrentUser({ ...currentUser, photo: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            {isEditing ? (
              <div>
                <button type="button" onClick={handleSubmit}>Valider</button>
                <button type="button" onClick={handleCancel}>Annuler</button>
              </div>
            ) : (
              <button type="button" onClick={handleCancel}>Retour à la liste</button>
            )}
          </form>
        </div>
      ) : (
        // Tableau des utilisateurs
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Âge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.age}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Modifier</button>
                  <button onClick={() => handleViewDetails(user)}>Voir Détails</button>
                  <button onClick={() => handleDelete(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeUtilisateurs;
