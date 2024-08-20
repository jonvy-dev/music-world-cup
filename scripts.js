document.addEventListener('DOMContentLoaded', () => {
    const songForm = document.getElementById('song-form');
    const songUrlInput = document.getElementById('song-url');
    const bracketContent = document.getElementById('bracket-content');
    const voteContent = document.getElementById('vote-content');

    let songs = [];

    songForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const url = songUrlInput.value;

        if (url) {
            // Add the song to the list
            songs.push(url);
            songUrlInput.value = '';
            updateBracket();
        }
    });

    function updateBracket() {
        if (songs.length === 0) {
            bracketContent.innerHTML = 'No songs submitted yet.';
            voteContent.innerHTML = 'No songs to vote on.';
            return;
        }

        // Update bracket display
        let bracketHtml = '<ul>';
        songs.forEach((song, index) => {
            bracketHtml += `<li><a href="${song}" target="_blank">${song}</a></li>`;
        });
        bracketHtml += '</ul>';
        bracketContent.innerHTML = bracketHtml;

        // Prepare voting (example: first two songs for voting)
        if (songs.length > 1) {
            voteContent.innerHTML = `
                <div>
                    <h3>Vote</h3>
                    <button onclick="voteForSong(0)">Vote for Song 1</button>
                    <button onclick="voteForSong(1)">Vote for Song 2</button>
                </div>
            `;
        }
    }

    window.voteForSong = (index) => {
        alert(`You voted for Song ${index + 1}: ${songs[index]}`);
        // Add voting logic here
    };
});
