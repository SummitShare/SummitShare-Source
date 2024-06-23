import { Note } from '@/utils/dev/frontEndInterfaces';
import axios, { AxiosError } from 'axios';
import matter from 'gray-matter';
    // console.log('Fetching notes with URL:', url);
const API_URL = 'https://api.hackmd.io/v1/notes';
const BEARER_TOKEN = process.env.HACKMD_API_TOKEN;

/**
 * Fetch all notes from the team's workspace
 * @returns {Promise<any[]>} List of notes
 */
export const fetchAllTeamNotes = async (): Promise<any[]> => {
  try {
    const url = `${API_URL}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const notes = response.data;

     const notesWithContent = await Promise.all(
      notes.map(async (note: Note) => {
        const contentResponse = await axios.get(`${API_URL}/${note.id}`, {
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });
        note.content = contentResponse.data.content;
        return note;
      })
    );

    return notesWithContent;
    // console.log('Fetched notes:', response.data); only for dev
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching all team notes:', error.response?.data || error.message);
    } else {
      console.error('Error fetching all team notes:', error);
    }
    throw new Error('Failed to fetch all team notes');
  }
};

/**
 * Fetch the content of a single note
 * @param {string} noteId - ID of the note to fetch
 * @returns {Promise<any>} Note content
 */
export const fetchNoteContent = async (noteId: string): Promise<any> => {
  try {
    const url = `${API_URL}/${noteId}`;
    // console.log('Fetching note with URL:', url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    // console.log('Fetched note:', response.data); -- only for dev
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching note with ID ${noteId}:`, error.response?.data || error.message);
    } else {
      console.error(`Error fetching note with ID ${noteId}:`, error);
    }
    throw new Error(`Failed to fetch note content for ID ${noteId}`);
  }
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
