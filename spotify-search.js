// Create a new file called spotify-search.js and add this code
const CLIENT_ID = '7fab5713b7734f7bb1e2448f7a77bff5'; // You'll need to get this from Spotify Developer Dashboard
const CLIENT_SECRET = '5247ec48069740309f26c194e209457d';

let accessToken = '';

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

async function searchSongs(query) {
    if (!accessToken) {
        accessToken = await getAccessToken();
    }

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data.tracks.items;
}

function displaySearchResults(songs) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    searchResults.style.display = 'block';

    songs.forEach(song => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div class="song-info">
                <div class="song-title">${song.name}</div>
                <div class="song-artist">${song.artists[0].name}</div>
            </div>
        `;
        
        resultItem.addEventListener('click', () => {
            const spotifyEmbed = document.getElementById('spotify-embed');
            spotifyEmbed.innerHTML = `
                <iframe 
                    style="border-radius:12px" 
                    src="https://open.spotify.com/embed/track/${song.id}?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowfullscreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
                </iframe>
            `;
            searchResults.style.display = 'none';
        });

        searchResults.appendChild(resultItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('song-search');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
            const songs = await searchSongs(query);
            displaySearchResults(songs);
        }
    });

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                const songs = await searchSongs(query);
                displaySearchResults(songs);
            }
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        const searchResults = document.getElementById('search-results');
        if (!searchResults.contains(e.target) && e.target !== searchInput && e.target !== searchButton) {
            searchResults.style.display = 'none';
        }
    });
});