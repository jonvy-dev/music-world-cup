document.addEventListener('DOMContentLoaded', () => {
    const songForm = document.getElementById('song-form');
    const songUrlInput = document.getElementById('song-url');
    const bracketContent = document.getElementById('bracket-content');
    const voteContent = document.getElementById('vote-content');

    let songs = [];
    let votes = {}; // To keep track of votes

    songForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const url = songUrlInput.value;

        if (url && validateSongUrl(url)) {
            // Fetch metadata and add song to list
            try {
                const metadata = await fetchSongMetadata(url);
                songs.push({ url, title: metadata.title });
                songUrlInput.value = '';
                updateBracket();
            } catch (error) {
                alert('Error fetching song metadata. Please try another URL.');
            }
        } else {
            alert('Please submit a valid YouTube or SoundCloud URL.');
        }
    });

    function validateSongUrl(url) {
        const youtubePattern = /^(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)/;
        const soundcloudPattern = /^(https:\/\/soundcloud\.com\/)/;
        return youtubePattern.test(url) || soundcloudPattern.test(url);
    }

    async function fetchSongMetadata(url) {
        if (url.includes('youtube.com')) {
            const videoId = new URL(url).searchParams.get('v');
            const apiKey = 'AIzaSyCK7Tv0v5GRgDSNLxcl1mgy_AL0QT6LAWU'; // Replace with your API key
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
            const data = await response.json();
            return { title: data.items[0].snippet.title };
        } else if (url.includes('soundcloud.com')) {
            const response = await fetch(`https://api.soundcloud.com/resolve?url=${url}&client_id=vqid22ZGcnOxBtYCdXruanj1aTJtEdnT`); // Replace with your client ID
            const data = await response.json();
            return { title: data.title };
        } else {
            throw new Error('Unsupported URL');
        }
    }

    function updateBracket() {
        if (songs.length === 0) {
            bracketContent.innerHTML = 'No songs submitted yet.';
            voteContent.innerHTML = 'No songs to vote on.';
            return;
        }

        createBracket(songs);

        if (songs.length > 1) {
            voteContent.innerHTML = `
                <div>
                    <h3>Vote</h3>
                    ${songs.slice(0, 2).map((song, index) => 
                        `<button onclick="voteForSong(${index})">Vote for Song ${index + 1}</button>`
                    ).join('<br>')}
                </div>
            `;
        }
    }

    function createBracket(songs) {
        let bracketHtml = '<ul>';
        for (let i = 0; i < songs.length; i += 2) {
            bracketHtml += `<li>
                <div>
                    <a href="${songs[i].url}" target="_blank">${songs[i].title}</a>
                    <button onclick="voteForSong(${i})">Vote</button>
                </div>
                ${songs[i + 1] ? `<div>
                    <a href="${songs[i + 1].url}" target="_blank">${songs[i + 1].title}</a>
                    <button onclick="voteForSong(${i + 1})">Vote</button>
                </div>` : ''}
            </li>`;
        }
        bracketHtml += '</ul>';
        bracketContent.innerHTML = bracketHtml;
    }

    window.voteForSong = (index) => {
        const song = songs[index];
        votes[song.url] = (votes[song.url] || 0) + 1;
        alert(`You voted for: ${song.title}`);
        // Implement further voting logic here (e.g., update bracket, handle next round)
        updateBracket(); // Refresh bracket
    };
});
