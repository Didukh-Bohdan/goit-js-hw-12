import { searchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');

searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search term'
        });
        return;
    }

    loader.style.display = 'block';
    gallery.innerHTML = '';

    try {
        const images = await searchImages(searchTerm);
        renderGallery(images);
    } catch (error) {
        loader.style.display = 'none';
        console.error('Error fetching data:', error);
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching data. Please try again.'
        });
    }
});