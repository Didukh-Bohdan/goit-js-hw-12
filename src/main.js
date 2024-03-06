import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImages } from './js/pixabay-api.js';
import { renderGallery, showLoadMoreButton, hideLoadMoreButton, showEndOfCollectionMessage } from './js/render-functions.js';

const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');
const lightbox = new SimpleLightbox('.gallery a');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

const LOADER_DISPLAY_BLOCK = 'block';
const LOADER_DISPLAY_NONE = 'none';
const PER_PAGE = 15;

function setLoaderDisplay(displayValue) {
    loader.style.display = displayValue;
}

let currentPage = 1;
let allResultsFetched = false;

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

    setLoaderDisplay(LOADER_DISPLAY_BLOCK);
    gallery.innerHTML = '';
    currentPage = 1;
    allResultsFetched = false;

    try {
        const data = await searchImages(searchTerm, currentPage);
        renderGallery(data.hits, true);

        if (data.hits.length === 0) {
            hideLoadMoreButton();
            showEndOfCollectionMessage();
        } else {
            showLoadMoreButton();
            currentPage++;
            smoothScrollToGallery();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching data. Please try again.'
        });
    } finally {
        setLoaderDisplay(LOADER_DISPLAY_NONE);
    }
});

loadMoreBtn.addEventListener('click', async function () {
    try {
        if (allResultsFetched) {
            hideLoadMoreButton();
            showEndOfCollectionMessage();
            return;
        }

        const searchTerm = searchInput.value.trim();
        setLoaderDisplay(LOADER_DISPLAY_BLOCK);

        const data = await searchImages(searchTerm, currentPage);

        if (!data.hits || data.hits.length === 0) {
            allResultsFetched = true;
            hideLoadMoreButton();
            showEndOfCollectionMessage();
        } else {
            renderGallery(data.hits, false);
            currentPage++;
            smoothScrollToGallery();
        }

        if (data.totalHits <= currentPage * PER_PAGE) {
            allResultsFetched = true;
            hideLoadMoreButton();
            showEndOfCollectionMessage(); 
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching more data. Please try again.'
        });
    } finally {
        setLoaderDisplay(LOADER_DISPLAY_NONE);
    }
});

function smoothScrollToGallery() {
    const cards = document.querySelectorAll('.card');
    
    if (cards.length > 0) {
        const cardHeight = cards[0].getBoundingClientRect().height;
        window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    }
}