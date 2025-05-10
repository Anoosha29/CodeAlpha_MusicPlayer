

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        playlistBtn: document.getElementById('playlistBtn'),
        playlistContainer: document.getElementById('playlistContainer'),
        overlay: document.getElementById('overlay'),
        playlistItems: document.querySelectorAll('.playlist-item'),
        playBtn: document.getElementById('playBtn'),
        playIcon: document.getElementById('playIcon'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        progressContainer: document.getElementById('progressContainer'),
        progressBar: document.getElementById('progressBar'),
        currentTimeEl: document.getElementById('currentTime'),
        durationEl: document.getElementById('duration'),
        albumArt: document.getElementById('albumArt'),
        songTitle: document.getElementById('songTitle'),
        songArtist: document.getElementById('songArtist'),
        playlistCount: document.getElementById('playlistCount')
    };

    // Audio Element
    const audio = new Audio();
    let isPlaying = false;
    let currentSongIndex = 0;

 // Playlist Data
const songs = [
    {
        title: "Sunny",
        artist: "KODOMOi",
        duration: "3:53",
        cover: "assets/images/sunny.jpg",
        src: "assets/audio/song1.mp3"
    },
    {
        title: "Alive",
        artist: "Ikson",
        duration: "3:13",
        cover: "assets/images/Alive.jpeg",
        src: "assets/audio/song2.mp3"
    },
    {
        title: "On & On",
        artist: "Cartoon ft. Daniel Levi",
        duration: "3:30",
        cover: "assets/images/on-on.jpeg",
        src: "assets/audio/song3.mp3"
    },
    {
        title: " Blue Sky ",
        artist: "Silent Partner",
        duration: "3:06",
        cover: "assets/images/blue-sky.jpeg",
         src: "assets/audio/song4.mp3"
    },
    {
        title: "Beech",
        artist: "MBB",
        duration: "2:02",
        cover: "assets/images/beech.jpeg",
         src: "assets/audio/song5.mp3"
    },
    {
        title: "Island",
        artist: "MBB",
        duration: "2:04",
        cover:"assets/images/island.jpg",
        src: "assets/audio/song6.mp3"
    }
];

    // Initialize
    initPlayer();

    // Functions
    function initPlayer() {
        // Set playlist count
        elements.playlistCount.textContent = `${songs.length} songs`;
        
        // Load first song
        loadSong(currentSongIndex);
        
        // Event listeners
        setupEventListeners();
        
        // Handle mobile viewport
        handleViewport();
    }

    function loadSong(index) {
        const song = songs[index];
        elements.songTitle.textContent = song.title;
        elements.songArtist.textContent = song.artist;
        elements.albumArt.src = song.cover;
        elements.durationEl.textContent = song.duration;
        audio.src = song.src;
        
        updateActiveItem();
    }

    function playSong() {
        isPlaying = true;
        elements.playIcon.classList.replace('fa-play', 'fa-pause');
        audio.play();
    }

    function pauseSong() {
        isPlaying = false;
        elements.playIcon.classList.replace('fa-pause', 'fa-play');
        audio.pause();
    }

    function togglePlay() {
        isPlaying ? pauseSong() : playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        changeSong();
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        changeSong();
    }

    function changeSong() {
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function updateProgress() {
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        elements.progressBar.style.width = `${progressPercent}%`;

        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        elements.currentTimeEl.textContent = 
            `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    }

    function togglePlaylist() {
        elements.playlistBtn.classList.toggle('active');
        elements.playlistContainer.classList.toggle('open');
        elements.overlay.classList.toggle('active');
        document.body.style.overflow = elements.playlistContainer.classList.contains('open') ? 'hidden' : '';
        
        if (elements.playlistBtn.classList.contains('active')) {
            animatePlaylistItems();
        }
    }

    function playSongFromPlaylist(index) {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
        togglePlaylist();
    }

    function updateActiveItem() {
        elements.playlistItems.forEach(item => item.classList.remove('active'));
        elements.playlistItems[currentSongIndex].classList.add('active');
    }

    function animatePlaylistItems() {
        elements.playlistItems.forEach((item, index) => {
            item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
        });
    }

    function handleViewport() {

        const setVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVh();
        window.addEventListener('resize', setVh);
    }

    function setupEventListeners() {
        
        elements.playlistBtn.addEventListener('click', togglePlaylist);
        elements.overlay.addEventListener('click', togglePlaylist);
        elements.playBtn.addEventListener('click', togglePlay);
        elements.prevBtn.addEventListener('click', prevSong);
        elements.nextBtn.addEventListener('click', nextSong);
        
   
        elements.progressContainer.addEventListener('click', setProgress);
        audio.addEventListener('timeupdate', updateProgress);
        
  
        audio.addEventListener('ended', nextSong);
        
        
        elements.playlistItems.forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                playSongFromPlaylist(index);
            });
        });
    }
});