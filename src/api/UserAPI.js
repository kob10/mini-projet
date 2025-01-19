import axios from 'axios';


// Mise à jour de la couleur de l'utilisateur
export const updateColorAPI = async (userId, color) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Jeton manquant, redirigez l'utilisateur vers la page de connexion.");
            window.location.href = '/login';
            return;
        }

        // Utiliser PUT pour mettre à jour l'utilisateur existant
        const response = await axios.put(
            `${URL}/${userId}`,  // Ajouter l'ID spécifique à l'URL
            { couleur: color },  // Utiliser 'couleur' au lieu de 'color'
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return response.data;  // Retourner l'utilisateur mis à jour
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la couleur:", error);
        throw error;
    }
};


const URL = 'https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire';
export const fetchUsersAPI = async () => {
    try {
      const response = await axios.get(URL);
      return response.data; 
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error; 
    }
  };
  export const updateUserAPI = async (userId, updatedData) => {
    try {
      const response = await axios.put(`${URL}/${userId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  };
  
  // Fonction pour supprimer un utilisateur
  export const deleteUserAPI = async (userId) => {
    try {
      const response = await axios.delete(`${URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  };