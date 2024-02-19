import iziToast from "izitoast";
import SimpleLightbox from "simplelightbox";
import "izitoast/dist/css/iziToast.min.css";
import "simplelightbox/dist/simple-lightbox.min.css";

const loader = document.getElementById('loader');
const gallery = document.getElementById('gallery');
const lightbox = new SimpleLightbox('.gallery a');

export function renderGallery(images) {
    loader.style.display = 'none';

    if (images.length === 0) {
        iziToast.info({
            title: 'Info',
            message: 'Sorry, there are no images matching your search query. Please try again!'
        });
        return;
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

    // Refresh the lightbox
    lightbox.refresh();
}