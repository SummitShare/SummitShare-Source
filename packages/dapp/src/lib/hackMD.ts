import axios, { AxiosError } from 'axios';
import matter from 'gray-matter';
import { Note } from '@/utils/dev/frontEndInterfaces';

const API_URL = 'https://api.hackmd.io/v1/notes';
const BEARER_TOKEN = process.env.HACKMD_API_TOKEN as string;

const axiosInstance = axios.create({
   baseURL: API_URL,
   headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
   },
   timeout: 10000, // 10 seconds timeout
});

const retryRequest = async (
   fn: () => Promise<any>,
   retries: number = 3,
   delay: number = 1000
): Promise<any> => {
   try {
      return await fn();
   } catch (error) {
      if (retries === 0) {
         throw error;
      }
      if (axios.isAxiosError(error) && error.response?.status === 429) {
         // If rate-limited, wait a bit longer before retrying
         delay = delay * 2;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
   }
};

// Simple in-memory cache
const cache: { [key: string]: any } = {};
const CACHE_DURATION = 60000; // Cache duration in milliseconds (e.g., 60 seconds)

/**
 * Fetch all notes from the team's workspace
 * @returns {Promise<Note[]>} List of notes
 */
export const fetchAllTeamNotes = async (): Promise<Note[]> => {
   const cacheKey = 'allTeamNotes';
   const cachedData = cache[cacheKey];

   if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
   }

   try {
      // //console.log('Fetching all team notes...');
      const response = await retryRequest(() => axiosInstance.get('/'));
      // //console.log('Fetched notes:', response.data);
      const notes: Note[] = response.data;

      const notesWithContent = await Promise.all(
         notes.map(async (note) => {
            // //console.log(`Fetching content for note ID ${note.id}...`);
            const contentResponse = await retryRequest(() =>
               axiosInstance.get(`/${note.id}`)
            );
            note.content = contentResponse.data.content;
            // //console.log(`Fetched content for note ID ${note.id}`);
            return note;
         })
      );

      // Cache the data
      cache[cacheKey] = {
         timestamp: Date.now(),
         data: notesWithContent,
      };

      return notesWithContent;
   } catch (error) {
      if (axios.isAxiosError(error)) {
         console.error(
            'Error fetching all team notes:',
            error.response?.data || error.message
         );
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
   const cacheKey = `noteContent_${noteId}`;
   const cachedData = cache[cacheKey];

   if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
   }

   try {
      // //console.log(`Fetching content for note ID ${noteId}...`);
      const response = await retryRequest(() => axiosInstance.get(`/${noteId}`));
      // //console.log(`Fetched content for note ID ${noteId}:`, response.data);

      // Cache the data
      cache[cacheKey] = {
         timestamp: Date.now(),
         data: response.data,
      };

      return response.data;
   } catch (error) {
      if (axios.isAxiosError(error)) {
         console.error(
            `Error fetching note with ID ${noteId}:`,
            error.response?.data || error.message
         );
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
export const parseNoteContent = (
   content: string
): { data: any; content: string } => {
   const parsed = matter(content);
   return {
      data: parsed.data,
      content: parsed.content,
   };
};
