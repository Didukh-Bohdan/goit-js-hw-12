import { renderGallery, showLoadMoreButton, hideLoadMoreButton, showEndOfCollectionMessage } from './js/render-functions.js';
import { searchImages } from './js/pixabay-api.js';

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let currentPage = 1;
const MAX_RESULTS_PER_PAGE = 15;

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
        currentPage = 1; 
        await performSearchAndRender(searchTerm, currentPage);
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
        await performSearchAndRender(searchTerm, currentPage);
    } catch (error) {
        console.error('Error fetching data:', error);
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching more data. Please try again.'
        });
    }
});

async function performSearchAndRender(query, page) {
    try {
        const data = await searchImages(query, page, MAX_RESULTS_PER_PAGE);

        const isEndOfCollection = data.totalHits <= page * MAX_RESULTS_PER_PAGE;

        renderGallery(data.hits, page === 1);

        if (data.hits.length === 0 || isEndOfCollection) {
            hideLoadMoreButton();
            if (isEndOfCollection) {
                showEndOfCollectionMessage();
            }
        } else {
            showLoadMoreButton();
            currentPage++;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } finally {
        loader.style.display = 'none';
    }
}
