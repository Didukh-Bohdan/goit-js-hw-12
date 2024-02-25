// const API_KEY = '42306432-61ab7fb6a7e28dda5f126fb86';

import axios from 'axios';

const apiKey = '42306432-61ab7fb6a7e28dda5f126fb86';

export async function searchImages(query, page = 1, perPage = 15) {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${query}&page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
