document.addEventListener("DOMContentLoaded", player);

function player() {
	// requests
	// --------
	const request = (url) => fetch(url).then((res) => res.json());
	const station = "https://media.money4you.financial:8032/api/station/1";
	const status = "https://media.money4you.financial:8032/api/status";
	const time = "https://media.money4you.financial:8032/api/time";
	const nowplaying = "https://media.money4you.financial:8032/api/nowplaying/1";
	const src = "https://media.money4you.financial:8033/radio.mp3";

	// varables
	// --------
	const playerImage = document.querySelector("#playerImage");
	const playerTitle = document.querySelector("#playerTitle");
	const playerArtist = document.querySelector("#playerArtist");
	const playerAudio = document.querySelector("#playerAudio");
	const playerBtnPlay = document.querySelector("#playerBtnPlay");

	// templates
	// ---------
	const playerAudioTemp = `
	<source src="%src%"></source>
`;
	const playerImageTemp = `
	<img class="pl-image__source" src="%src%" alt="Album image">
`;
	const playerTextTemp = `
	<h3 class="pl-text">%text%</h3>
`;

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

	// main
	// ----
	const Player = {
		main: this.main,
		src: this.src,
		remaining: this.remaining,
		elapsed: this.elapsed,
		timestamp: this.timestamp,
		art: this.art,
		title: this.title,

		status: this.status,
		time: this.time,

		init: async function () {
			await this._update()
				.then(() => {
					playerAudio.innerHTML = playerAudioTemp.replace("%src%", src);
				})
				.then(() => this._play())
				.then(() => console.log("init: play and update first time"));
		},

		_update: async function () {
			await request(nowplaying)
				.then((res) => {
					this.art = res.now_playing.song.art;
					this.title = res.now_playing.song.text;
				})
				.then(() => this._render());
		},

		_render: function () {
			playerImage.innerHTML = playerImageTemp.replace("%src%", this.art);
			playerTitle.innerHTML = playerTextTemp.replace("%text%", this.title);
		},

		_play: async function () {
			playerBtnPlay.addEventListener("click", () => {
				this._debounce();
				playerAudio.play();
			});
		},

		_remaining: async function () {
			await request(nowplaying).then((res) => {
				this.remaining = Number(res.now_playing.remaining * 1000);
			});
		},

		_elapsed: async function () {
			await request(nowplaying).then((res) => {
				this.elapsed = Number(res.now_playing.elapsed);
			});

			await request(status).then((res) => (this.timestamp = res.timestamp));
			await request(time).then((res) => (this.time = res.timestamp));
		},

		_debounce: function () {
			debounce(async () => {
				await this._update().then(() => console.log("_debounce: re-update"));
			}, 5000)();
		},
	};

	Player.init();
}
