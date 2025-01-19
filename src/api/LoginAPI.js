import axios from 'axios';

const URL = 'https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire';

// Mocked example: Return a fake token when the login is successful
export const verifyLogin = async (nom, motDePasse) => {
    try {
        const response = await axios.get(URL);
        const users = response.data;

        const user = users.find(u => u.nom === nom && u.MotDePasse === motDePasse);

        if (user) {
            // Mock a token (in a real-world case, you'd generate or receive one from a backend)
            const token = 'fake-jwt-token'; 

            // Return the user and the token
            return { success: true, user, token };
        } else {
            return { success: false, message: 'Nom ou mot de passe incorrect.' };
        }
    } catch (error) {
        console.error('Erreur lors de la connexion à l\'API:', error);
        return { success: false, message: 'Erreur lors de la connexion à l\'API.' };
    }
};
