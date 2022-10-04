document.addEventListener("DOMContentLoaded", player);

function player() {
	// requests
	// --------
	const request = (url) => fetch(url).then((res) => res.json());
	const station = "https://media.money4you.financial:8032/api/station/1";
	const nowplaying = "https://media.money4you.financial:8032/api/nowplaying";
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
		art: this.art,
		title: this.title,

		_update: async function () {
			await request(nowplaying).then((res) => {
				this.src = src;
				this.main = res[0].now_playing;
				this.remaining = Number(res[0].now_playing.remaining * 1000);
				this.art = res[0].now_playing.song.art;
				this.title = res[0].now_playing.song.text;
			});
			await this._render();
		},

		_play: async function () {
			await this._debounce();
			playerBtnPlay.addEventListener("click", () => {
				playerAudio.paused ? playerAudio.play() : playerAudio.pause();
			});
		},

		_render: function () {
			playerImage.innerHTML = playerImageTemp.replace("%src%", this.art);
			playerTitle.innerHTML = playerTextTemp.replace("%text%", this.title);
			playerAudio.innerHTML = playerAudioTemp.replace("%src%", this.src);
		},

		_debounce: function () {
			debounce(async () => {
				await this._update();
				console.log(this.remaining);
				// }, this.remaining)();
			}, 1000)();
		},

		init: async function () {
			await this._update();
			this._play();
		},
	};

	Player.init();
}
