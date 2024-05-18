import axios from 'axios';
import matter from 'gray-matter';

const API_URL = 'https://api.hackmd.io/v1';
const TEAM_PATH = 'summitshare-eth'; 
const BEARER_TOKEN = process.env.HACKMD_API_TOKEN;;  

/**
 * Fetch all notes from the team's workspace
 * @returns {Promise<any[]>} List of notes
 */
export const fetchAllTeamNotes = async (): Promise<any[]> => {
  const response = await axios.get(`${API_URL}/teams/${TEAM_PATH}/notes`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response.data;
};

/**
 * Fetch the content of a single note
 * @param {string} noteId - ID of the note to fetch
 * @returns {Promise<any>} Note content
 */
export const fetchNoteContent = async (noteId: string): Promise<any> => {
  const response = await axios.get(`${API_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response.data;
};

/**
 * Parse the front matter and content of a note
 * @param {string} content - Raw content of the note
 * @returns {object} Parsed front matter and content
 */
export const parseNoteContent = (content: string): { data: any; content: string } => {
  const parsed = matter(content);
  return {
    data: parsed.data,
    content: parsed.content,
  };
};

/**
 * Example usage:
 * 
 *  Fetch and display all notes
 * fetchAllTeamNotes().then(notes => {
 *   console.log('All notes:', notes);
 * });
 * 
 *  Fetch and display content of a specific note
 * const noteId = 'your-note-id';
 * fetchNoteContent(noteId).then(note => {
 *   console.log('Note content:', note);
 * });
 * 
 * /Parse the content of a note
 * const rawContent = '# Title\nContent of the note';
 * const parsed = parseNoteContent(rawContent);
 * console.log('Parsed note:', parsed);
 */

