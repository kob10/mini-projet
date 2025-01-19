import React, { useState, useEffect } from 'react';

function PromotionAdmin() {
  const [nonAdminUsers, setNonAdminUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState('');
  const [manualInput, setManualInput] = useState({
    nom: '',
    prenom: '',
    email: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire');
        const data = await response.json();
        setAllUsers(data); 
        const nonAdmins = data.filter(user => !user.admin);
        setNonAdminUsers(nonAdmins);
      } catch (err) {
        setError('Erreur lors de la récupération des utilisateurs.');
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    
    // Clear manual input when a user is selected
    if (userId) {
      setManualInput({ nom: '', prenom: '', email: '' });
    }
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualInput(prev => ({ ...prev, [name]: value }));
    
    // Clear selected user when manual input is started
    if (value) {
      setSelectedUser('');
    }
  };

  const promoteToAdmin = async () => {
    try {
      let userToPromote;

      if (selectedUser) {
        userToPromote = nonAdminUsers.find(u => u.id === selectedUser);
        
        // Update existing user
        const updateResponse = await fetch(
          `https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${userToPromote.id}`, 
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...userToPromote, admin: true })
          }
        );
        userToPromote = await updateResponse.json();
      } else if (manualInput.nom && manualInput.prenom && manualInput.email) {
        // Check if user already exists
        const existingUser = allUsers.find(
          u => u.email.toLowerCase() === manualInput.email.toLowerCase()
        );

        if (existingUser) {
          // Update existing user
          const updateResponse = await fetch(
            `https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${existingUser.id}`, 
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...existingUser, admin: true })
            }
          );
          userToPromote = await updateResponse.json();
        } else {
          // Create new user
          const newUserResponse = await fetch(
            'https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire', 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...manualInput, admin: true })
            }
          );
          userToPromote = await newUserResponse.json();
        }
      } else {
        setError('Veuillez sélectionner un utilisateur ou remplir tous les champs manuellement.');
        return;
      }

      // Update local state
      setAllUsers(prev => 
        prev.map(u => u.id === userToPromote.id ? { ...u, admin: true } : u)
      );
      setNonAdminUsers(prev => prev.filter(u => u.id !== userToPromote.id));
      
      setMessage(`${userToPromote.prenom} ${userToPromote.nom} a été promu administrateur.`);
      setError('');

      // Reset form
      setSelectedUser('');
      setManualInput({ nom: '', prenom: '', email: '' });
    } catch (err) {
      setError('Erreur lors de la promotion de l\'utilisateur.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Promotion Administrateur</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Sélectionner un utilisateur</label>
        <select 
          value={selectedUser} 
          onChange={handleUserSelect}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">Choisir un utilisateur</option>
          {nonAdminUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.prenom} {user.nom} - {user.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>Ou saisir manuellement</h3>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={manualInput.nom}
          onChange={handleManualInputChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={manualInput.prenom}
          onChange={handleManualInputChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={manualInput.email}
          onChange={handleManualInputChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>

      <button 
        onClick={promoteToAdmin} 
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none',
          cursor: 'pointer'
        }}
        disabled={!selectedUser && (!manualInput.nom || !manualInput.prenom || !manualInput.email)}
      >
        Promouvoir en Administrateur
      </button>
    </div>
  );
}

export default PromotionAdmin;