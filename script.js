const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
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
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        durationEl.innerText = formatTime(audio.duration);
    }
});

progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});
// --- 增强版进度条逻辑开始 ---

// 辅助函数：将秒数转换成 0:00 格式
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// 1. 监听音频播放进度更新 (实时更新进度条和左侧时间)
audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        durationEl.innerText = formatTime(audio.duration);
    }
});

// 2. 监听元数据加载 (确保一点击歌名就能拿到总时长)
audio.addEventListener('loadedmetadata', () => {
    if (!isNaN(audio.duration)) {
        durationEl.innerText = formatTime(audio.duration);
    }
});

// 3. 监听手动拖动进度条
progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration)) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
});

// --- 增强版进度条逻辑结束 ---
// 1. 定义歌词数据 (秒数: 歌词文字)
const lyricsData = {
    0: { 0: "热河 - 相信未来现场", 5: "没有人在热河路谈恋爱", 10: "总有人在热河路等车", 15: "这条路从来不缺故事" },
    1: { 0: "关于郑州的记忆", 5: "关于郑州我想的全是你", 10: "想来想去都是那些往事" },
    2: { 0: "你离开了南京", 5: "从此没有人和我说话", 10: "这浪漫的野花也谢了" }
};

const lyricsContainer = document.getElementById('lyrics-container');

// 2. 更新歌词显示的函数
audio.addEventListener('timeupdate', () => {
    const currentSongLyrics = lyricsData[currentIndex];
    if (!currentSongLyrics) return;

    const currentTime = Math.floor(audio.currentTime);
    
    // 寻找当前时间点对应的歌词
    for (let time in currentSongLyrics) {
        if (currentTime == time) {
            // 渲染歌词到屏幕
            lyricsContainer.innerHTML = `<p class="lyric-line active">${currentSongLyrics[time]}</p>`;
        }
    }
});
