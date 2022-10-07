document.addEventListener("DOMContentLoaded", radio);

function radio() {
	// requests
	// --------
	const request = (url) => fetch(url).then((res) => res.json());
	const nowplaying = "https://media.money4you.financial:8032/api/nowplaying/1";
	const src = "https://media.money4you.financial:8033/radio.mp3";
	const audio = new Audio();

	// variables
	// --------
	const playerImage = document.querySelector("#playerImage");
	const playerTitle = document.querySelector("#playerTitle");
	const playerBtnPlay = document.querySelector("#playerBtnPlay");
	const playerTrack = document.querySelector("#playerTrack");

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
			playerImage.innerHTML = playerImageTemp.replace("%src%", this.art);
			playerTitle.innerHTML = playerTextTemp.replace("%text%", this.title);
		},

		_play: function () {
			playerBtnPlay.addEventListener("click", async () => {
				if (!audio.paused) {
					audio.pause();
				} else {
					song(src);
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
				const width =
					((this.data.duration - (this.songEndTimestamp - Math.floor(Date.now() / 1000))) / this.data.duration) * 100;
				console.log(width);
				playerTrack.style.width = `${width}%`;

				// console.log(this.songEndTimestamp - Math.floor(Date.now() / 1000));
			}, 1000)();
		},
	};

	Player.init();
}
