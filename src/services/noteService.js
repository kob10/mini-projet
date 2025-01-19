import axios from 'axios';

const BASE_URL = 'https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire';

export const noteService = {
  // Get note for a specific user
  getNoteByUser: async (user) => {
    try {
      // Assuming you want to find a note by user
      const response = await axios.get(`${BASE_URL}`, {
        params: { user: user }
      });
      // Return the first matching note or null
      return response.data[0]?.note || null;
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  },

  // Add or update a note for a user
  addOrUpdateNote: async (user, note) => {
    try {
      // First, check if a note for the user already exists
      const existingNotes = await axios.get(`${BASE_URL}`, {
        params: { user: user }
      });

      if (existingNotes.data.length > 0) {
        // If note exists, update the existing note
        const existingNote = existingNotes.data[0];
        const response = await axios.put(`${BASE_URL}/${existingNote.id}`, { 
          user, 
          note 
        });
        return response.data;
      } else {
        // If no note exists, create a new one
        const response = await axios.post(`${BASE_URL}`, { 
          user, 
          note 
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error adding/updating note:', error);
      throw error;
    }
  },

  // Delete a note for a specific user
  deleteNote: async (user) => {
    try {
      // Find the note first
      const existingNotes = await axios.get(`${BASE_URL}`, {
        params: { user: user }
      });

      if (existingNotes.data.length > 0) {
        // Delete the first matching note
        const noteToDelete = existingNotes.data[0];
        const response = await axios.delete(`${BASE_URL}/${noteToDelete.id}`);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
};