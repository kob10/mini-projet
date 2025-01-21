import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addLog, updateLog } from '../store/trackingReducer';
import { useNavigate } from 'react-router-dom';
import './CSS/TrackingPanel.css';

function TrackingPanel() {
  const logs = useSelector((state) => state.tracking.logs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterUser, setFilterUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userNotes, setUserNotes] = useState({});
  const [favorites, setFavorites] = useState(() => {
    // Récupérer les favoris depuis localStorage
    const savedFavorites = localStorage.getItem('trackingFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    // Sauvegarder les favoris dans localStorage
    localStorage.setItem('trackingFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire');
      const formattedLogs = response.data.map(log => ({
        ...log,
        noteHistory: log.noteHistory || []
      }));
      dispatch(addLog(formattedLogs));

      // Initialiser les notes locales à partir des logs de l'API
      const notes = {};
      formattedLogs.forEach(log => {
        if (log.note) {
          notes[log.nom] = log.note;
        }
      });
      setUserNotes(notes);
    } catch (err) {
      console.error('Erreur lors du chargement des logs :', err);
    }
  };

  const handleAddNote = async (log) => {
    const note = prompt(`Entrez votre note pour ${log.nom}:`);
    if (note) {
      try {
        const actionText = log.note ? 'Note modifiée' : 'Note ajoutée';
        const updatedLog = {
          ...log,
          note,
          action: actionText, // Mettre à jour le champ action
          timestamp: new Date().toISOString(), // Mettre à jour le timestamp
          noteHistory: [...(log.noteHistory || []), {
            content: note,
            modifiedAt: new Date().toISOString(),
          }],
          lastModified: new Date().toISOString(),
        };

        // Mettre à jour l'API
        await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${log.id}`, updatedLog);

        // Mettre à jour le state local
        setUserNotes((prevNotes) => ({
          ...prevNotes,
          [log.nom]: note,
        }));

        // Mettre à jour Redux
        dispatch(updateLog(updatedLog));
      } catch (err) {
        console.error('Erreur lors de la mise à jour de la note :', err);
      }
    }
  };

  const handleDeleteNote = async (log) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette note ?')) {
      try {
        const updatedLog = {
          ...log,
          note: '',
          action: 'Note supprimée', // Mettre à jour le champ action
          timestamp: new Date().toISOString(), // Mettre à jour le timestamp
          noteHistory: [...(log.noteHistory || []), {
            content: 'Note supprimée',
            modifiedAt: new Date().toISOString(),
          }],
          lastModified: new Date().toISOString(),
        };

        // Mettre à jour l'API
        await axios.put(`https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire/${log.id}`, updatedLog);

        // Mettre à jour le state local
        setUserNotes((prevNotes) => {
          const updatedNotes = { ...prevNotes };
          delete updatedNotes[log.nom];
          return updatedNotes;
        });

        // Mettre à jour Redux
        dispatch(updateLog(updatedLog));
      } catch (err) {
        console.error('Erreur lors de la suppression de la note :', err);
      }
    }
  };

  const handleGoHome = () => {
    navigate('/layout');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['User', 'Action', 'Timestamp', 'Note'],
      ...logs.map((log) => [
        log.nom,
        log.action,
        new Date(log.timestamp).toLocaleString(),
        log.note || 'No Note',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracking_logs.csv';
    a.click();
  };

  const toggleFavorite = (logId) => {
    if (favorites.includes(logId)) {
      // Retirer des favoris
      setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== logId));
    } else {
      // Ajouter aux favoris
      setFavorites((prevFavorites) => [...prevFavorites, logId]);
    }
  };

  const filteredLogs = logs
    .filter((log) => {
      const logDate = new Date(log.timestamp);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!filterUser || log.nom === filterUser) &&
        (!start || logDate >= start) &&
        (!end || logDate <= end)
      );
    })
    .filter((log) =>
      `${log.nom} ${log.action} ${new Date(log.timestamp).toLocaleString()}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  // Calculer les métriques de résumé
  const totalApiCalls = logs.length;

  const actionCount = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  const mostUsedAction = Object.entries(actionCount).reduce(
    (max, [action, count]) => (count > max.count ? { action, count } : max),
    { action: 'N/A', count: 0 }
  );

  // Trier les logs par timestamp pour trouver la dernière activité
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latestActivity = sortedLogs.length
    ? new Date(sortedLogs[0].timestamp).toLocaleString()
    : 'No Activity Yet';

  // Nombre total de notes ajoutées
  const totalNotesAdded = logs.filter(log => log.note).length;

  // Logs favoris
  const favoriteLogs = logs.filter(log => favorites.includes(log.id));

  return (
    <div className="panel-container">
      <h2 className="panel-header">Tracking Panel</h2>

      {/* Résumé d'activité */}
      <div className="summary-container">
        <h3>Résumé d'activité</h3>
        <ul>
          <li>Total des appels API : {totalApiCalls}</li>
          <li>Action la plus utilisée : {mostUsedAction.action} ({mostUsedAction.count} fois)</li>
          <li>Dernière activité : {latestActivity}</li>
          <li>Nombre total de notes ajoutées : {totalNotesAdded}</li>
        </ul>
      </div>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher des logs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Filtres */}
      <div className="filters">
        <label>
          Filtrer par utilisateur :
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="filter-input"
          >
            <option value="">Tous les utilisateurs</option>
            {[...new Set(logs.map((log) => log.nom))].map((user, index) => (
              <option key={index} value={user}>
                {user}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date de début :
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />
        </label>
        <label>
          Date de fin :
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />
        </label>
      </div>

      {/* Section des favoris */}
      {favoriteLogs.length > 0 && (
        <div className="favorites-section">
          <h3>Favoris</h3>
          <table className="table-style">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Heure/Date</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {favoriteLogs.map((log, index) => (
                <tr key={log.id || index}>
                  <td>{log.nom}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.note || 'Aucune note'}</td>
                  <td>
                    <div className="action-zone flex space-x-2">
                      <button
                        onClick={() => handleAddNote(log)}
                        className="btn-note"
                      >
                        Ajouter/Modifier Note
                      </button>
                      {log.note && (
                        <button
                          onClick={() => handleDeleteNote(log)}
                          className="btn-delete-note"
                        >
                          Supprimer Note
                        </button>
                      )}
                      <button
                        onClick={() => toggleFavorite(log.id)}
                        className="btn-favorite"
                      >
                        {favorites.includes(log.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tableau des logs */}
      {filteredLogs.length === 0 ? (
        <p className="no-logs">Aucun log correspondant trouvé.</p>
      ) : (
        <table className="table-style">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Heure/Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={log.id || index}>
                <td>{log.nom}</td>
                <td>{log.action}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.note || 'Aucune note'}</td>
                <td>
                  <div className="action-zone flex space-x-2">
                    <button
                      onClick={() => handleAddNote(log)}
                      className="btn-note"
                    >
                      Ajouter/Modifier Note
                    </button>
                    {log.note && (
                      <button
                        onClick={() => handleDeleteNote(log)}
                        className="btn-delete-note"
                      >
                        Supprimer Note
                      </button>
                    )}
                    <button
                      onClick={() => toggleFavorite(log.id)}
                      className="btn-favorite"
                    >
                      {favorites.includes(log.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="button-group">
        <button onClick={exportToCSV} className="btn-export">
          Exporter les logs
        </button>
        <button onClick={handleGoHome} className="btn-home">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default TrackingPanel;