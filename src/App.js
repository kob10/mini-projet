import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Accueil from './components/Accueil';
import VoirProfile from './components/VoirProfile';
import ListeUtilisateurs from './components/ListeUtilisateurs';
import AjouterUtilisateur from './components/AjouterUtilisateur';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import ChangeColor from './components/ChangeColor';
import DemandesUtilisateurs from './components/DemandesUtilisateurs';
import TrackingPanel from './components/TrackingPanel';

// New Admin Route Protection Component
const AdminRoute = ({ children }) => {
  const user = useSelector(state => state.auth.user);
  
  return user?.admin 
    ? children 
    : <Navigate to="/layout/accueil" replace />;
};

function App() {
  const user = useSelector(state => state.auth.user);

  return (
    <Router>
  <Routes>
  <Route path="/admin/tracking" element={<TrackingPanel />} />
    {/* Pages de connexion et création de compte */}
    <Route path="/login" element={<Login />} />
    <Route path="/CreateAccount" element={<CreateAccount />} />

    {/* Route principale avec Layout */}
    <Route 
      path="/layout" 
      element={user ? <Layout /> : <Navigate to="/login" />}
    >
      <Route index element={<Accueil />} />
      <Route path="accueil" element={<Accueil />} />
      <Route path="voir-mon-profile" element={<VoirProfile />} />
      
      {/* Routes protégées pour l'admin */}
      <Route 
        path="liste-utilisateurs" 
        element={(
          <AdminRoute>
            <ListeUtilisateurs />
          </AdminRoute>
        )} 
      />
      <Route 
        path="ajouter-utilisateur" 
        element={(
          <AdminRoute>
            <AjouterUtilisateur />
          </AdminRoute>
        )} 
      />
      <Route 
        path="demande-utilisateur" 
        element={(
          <AdminRoute>
            <DemandesUtilisateurs />
          </AdminRoute>
        )} 
      />

      {/* Route Modifier Couleur */}
      <Route path="change-color" element={<ChangeColor />} />
    </Route>

    {/* Redirection par défaut */}
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
</Router>

  );
}

export default App;
