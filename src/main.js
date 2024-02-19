import iziToast from 'izitoast'; 
import { searchImages } from './js/pixabay-api.js';
import { renderGallery, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions.js';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let currentPage = 1;

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
        const data = await searchImages(searchTerm, currentPage);
        renderGallery(data.hits, currentPage === 1);

        if (data.hits.length === 0) {
            hideLoadMoreButton();
        } else {
            showLoadMoreButton();
            currentPage++;
        }
    } catch (error) {
        loader.style.display = 'none';
        console.error('Error fetching data:', error);
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching data. Please try again.'
        });
    }
});

loadMoreBtn.addEventListener('click', async () => {
    try {
        const searchTerm = searchInput.value.trim();
        const data = await searchImages(searchTerm, currentPage);
        renderGallery(data.hits, false);

        if (data.hits.length === 0) {
            hideLoadMoreButton();
        } else {
            currentPage++;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching more data. Please try again.'
        });
    }
});