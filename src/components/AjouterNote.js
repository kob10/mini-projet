import React from 'react';
import { NavLink } from 'react-router-dom';

const NavbarVertical = ({ isAdmin }) => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/layout/accueil">Accueil</NavLink>
        </li>
        {isAdmin && (
          <>
            <li>
              <NavLink to="/layout/liste-utilisateurs">Liste Utilisateurs</NavLink>
            </li>
            <li>
              <NavLink to="/layout/ajouter-utilisateur">Ajouter Utilisateur</NavLink>
            </li>
            <li>
              <NavLink to="/layout/ajouter-note">Ajouter Note</NavLink> {/* New Link */}
            </li>
          </>
        )}
        <li>
          <NavLink to="/layout/change-color">Change Color</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarVertical;
