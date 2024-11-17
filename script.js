document.addEventListener("DOMContentLoaded", () => {
    const poemGrid = document.querySelector(".poem-grid");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    poemGrid.classList.add("visible");
                }
            });
        },
        { threshold: 0.2 }
    );

    observer.observe(poemGrid);
});
document.getElementById("play-song").addEventListener("click", () => {
    const spotifyUrl = document.getElementById("spotify-url").value;

    // Validate the Spotify link
    if (!spotifyUrl.includes("open.spotify.com/track/")) {
        alert("Please enter a valid Spotify track link!");
        return;
    }

    // Extract the track ID from the URL
    const trackId = spotifyUrl.split("/track/")[1].split("?")[0];

    // Update the iframe with the new track
    document.getElementById("spotify-embed").innerHTML = `
        <iframe
            src="https://open.spotify.com/embed/track/${trackId}"
            width="100%"
            height="80"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"
        ></iframe>
    `;
});
