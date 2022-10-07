document.addEventListener("DOMContentLoaded", radio);

function radio() {
	// requests
	// --------
	const request = (url) => fetch(url).then((res) => res.json());
	const nowplaying = "https://media.money4you.financial:8032/api/nowplaying/1";
	const src = "https://media.money4you.financial:8033/radio.mp3";

	// varables
	// --------
	const playerImage = document.querySelector("#playerImage");
	const playerTitle = document.querySelector("#playerTitle");
	const playerBtnPlay = document.querySelector("#playerBtnPlay");

	// templates
	// ---------
	const playerImageTemp = `<img class="pl-image__source" src="%src%" alt="Album image">`;
	const playerTextTemp = `<h3 class="pl-text">%text%</h3>`;

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

	// audio source
	const audio = new Audio();
	function songStart(songUrl) {
		audio.src = songUrl;
		audio.play();
	}

	// main
	// ----
	const Player = {
		main: this.main,
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
					this.art = res.now_playing.song.art;
					this.title = res.now_playing.song.text;
					this.songEndTimestamp = res.now_playing.duration + res.now_playing.played_at;
					this.playedAt = res.now_playing.played_at;
					this.main = res.now_playing;
				})
				.then(() => this._render());
		},

		_render: function () {
			playerImage.innerHTML = playerImageTemp.replace("%src%", this.art);
			playerTitle.innerHTML = playerTextTemp.replace("%text%", this.title);
		},

		_play: function () {
			playerBtnPlay.addEventListener("click", async () => {
				if (!audio.paused) {
					audio.pause();
				} else {
					songStart(src);
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
				console.log(this.songEndTimestamp - Math.floor(Date.now() / 1000));
			}, 1000)();
		},
	};

	Player.init();
}
