import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');
const lightbox = new SimpleLightbox('.gallery a');
const loadMoreBtn = document.getElementById('loadMoreBtn');

export function renderGallery(images, isFirstLoad) {
    loader.style.display = 'none';

    if (images.length === 0) {
        iziToast.info({
            title: 'Info',
            message: 'Sorry, there are no images matching your search query. Please try again!'
        });
        hideLoadMoreButton();
        return;
    }

    if (isFirstLoad) {
        showLoadMoreButton();
    }

    images.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <a href="${image.largeImageURL}" data-lightbox="gallery">
                <img src="${image.webformatURL}" alt="${image.tags}">
            </a>
            <p>Likes: ${image.likes}</p>
            <p>Views: ${image.views}</p>
            <p>Comments: ${image.comments}</p>
            <p>Downloads: ${image.downloads}</p>
        `;
        gallery.appendChild(card);
    });

    lightbox.refresh();
}

export function hideLoadMoreButton() {
    loadMoreBtn.style.display = 'none';
}

export function showLoadMoreButton() {
    loadMoreBtn.style.display = 'block';
}

export function showEndOfCollectionMessage() {
    iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results."
    });
}
