const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playlist = document.getElementById('playlist');
const items = playlist.getElementsByTagName('li');
const currentTitle = document.getElementById('current-title');

let currentIndex = 0;

function loadSong(index) {
    const li = items[index];
    const src = li.getAttribute('data-src');
    audio.src = src;
    currentTitle.innerText = li.innerText;
    
    // 更新样式
    for (let item of items) item.classList.remove('active-song');
    li.classList.add('active-song');
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = "暂停";
    } else {
        audio.pause();
        playBtn.innerText = "播放";
    }
}

playBtn.addEventListener('click', togglePlay);

// 点击列表切歌
for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', () => {
        currentIndex = i;
        loadSong(currentIndex);
        audio.play();
        playBtn.innerText = "暂停";
    });
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    loadSong(currentIndex);
    audio.play();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    loadSong(currentIndex);
    audio.play();
});

// 初始化第一首
loadSong(currentIndex);
// 监听播放结束事件
audio.addEventListener('ended', () => {
    // 自动切换到下一首
    currentIndex = (currentIndex + 1) % items.length;
    loadSong(currentIndex);
    audio.play();
    playBtn.innerText = "暂停";
});
