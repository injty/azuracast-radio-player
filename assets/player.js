document.addEventListener("DOMContentLoaded", radio);

function radio() {
  // requests
  // --------
  const request = (url) => fetch(url).then((res) => res.json());
  const nowplaying = "https://radio.money4you.financial/api/nowplaying/1";
  const src = "https://radio.money4you.financial/listen/money4you/radio.mp3";
  const audio = new Audio();

  // variables
  // --------
  const playerBody = document.querySelector("#playerBody");
  const playerImage = document.querySelector("#playerImage");
  const playerTitle = document.querySelector("#playerTitle");
  const playerPlayBtn = document.querySelector("#playerPlayBtn");
  const playerTrack = document.querySelector("#playerTrack");
  const playerMinutes = document.querySelector("#playerMinutes");
  const playerSeconds = document.querySelector("#playerSeconds");

  const playerImageWrapper = document.querySelector(".pl-wrapper-image");
  const playerInfoWrapper = document.querySelector(".pl-wrapper-info");
  const playerCloseBtn = document.querySelector("#playerCloseBtn");
  const switcher = document.querySelector("#plSwitcher");

  switcher.addEventListener("click", () => {
    playerBody.classList.toggle("pl-switcher-active");
  });

  playerCloseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    playerImageWrapper.classList.toggle("pl-wrapper-image-active");
    playerInfoWrapper.classList.toggle("pl-wrapper-info-active");
  });

  // templates
  // ---------
  const playerImageTemp = `<img class="pl-image__source" src="%src%" alt="Album image">`;
  const playerTextTemp = `<p class="pl-text">%text%</p>`;

  // debounce
  // --------
  const debounce = (fn, ms) => {
    let timer;
    return function () {
      clearInterval(timer);
      timer = setInterval(() => {
        fn.apply(this, arguments);
      }, ms);
    };
  };

  // audio
  function song(src) {
    audio.src = src;
    audio.play();
  }

  // main
  // ----
  const Player = {
    data: this.data,
    art: this.art,
    title: this.title,
    songEndTimestamp: this.songEndTimestamp,

    init: function () {
      this._update()
        .then(() => this._play())
        .then(() => console.log("init: _update() and _play() first time"));
    },

    _update: async function () {
      await request(nowplaying)
        .then((res) => {
          this.data = res.now_playing;
        })
        .then(() => {
          this.art = this.data.song.art;
          this.title = this.data.song.text;
          this.songEndTimestamp = this.data.duration + this.data.played_at;
          this.playedAt = this.data.played_at;
        })
        .then(() => this._render());
    },

    _render: function () {
      const min = Math.floor(this.data.duration / 60);
      const sec = Math.floor(this.data.duration % 60);

      min <= 9 ? (playerMinutes.innerHTML = `0${min}`) : (playerMinutes.innerHTML = min);
      sec <= 9 ? (playerSeconds.innerHTML = `0${sec}`) : (playerSeconds.innerHTML = sec);

      playerImage.innerHTML = playerImageTemp.replace("%src%", this.art);
      playerTitle.innerHTML = playerTextTemp.replace("%text%", this.title, this.data.song.title);
    },

    _play: function () {
      playerPlayBtn.addEventListener("click", async () => {
        if (!audio.paused) {
          audio.pause();
          playerPlayBtn.innerHTML = `<i class="fas fa-play-circle"></i>`;
        } else {
          song(src);
          playerPlayBtn.innerHTML = `<i class="fas fa-pause-circle"></i>`;
        }
      });

      this._debounce();
      console.log("update debounce from play function");
    },

    _debounce: function () {
      debounce(async () => {
        if (Math.floor(Date.now() / 1000) >= this.songEndTimestamp) {
          await this._update();
          console.log("upgrade update from debounce function");
        }
        console.log(this.data);
        const width = ((this.data.duration - (this.songEndTimestamp - Math.floor(Date.now() / 1000))) / this.data.duration) * 100;
        playerTrack.style.width = `${width}%`;
      }, 1000)();
    },
  };

  Player.init();
}
