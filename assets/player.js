document.addEventListener("DOMContentLoaded", radio);

function radio() {
	// requests
	// --------
	const request = (url) => fetch(url).then((res) => res.json());
	const station = "https://media.money4you.financial:8032/api/station/1";
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
		art: this.art,
		title: this.title,

		soundTime: this.soundTime,

		init: function () {
			this._update()
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
					this.soundTime = res.now_playing.duration + res.now_playing.played_at;
				})
				.then(() => this._render());
		},

		_render: function () {
			playerImage.innerHTML = playerImageTemp.replace("%src%", this.art);
			playerTitle.innerHTML = playerTextTemp.replace("%text%", this.title);
		},

		_play: function () {
			playerBtnPlay.addEventListener("click", () => {
				playerAudio.play();
			});
			this._debounce();
			console.log("update debounce from play function");
		},

		_debounce: function () {
			debounce(async () => {
				if (Math.floor(Date.now() / 1000) >= this.soundTime) {
					await this._update();
					console.log("upgrade update from debounce function");
				}
				console.log(this.soundTime - Math.floor(Date.now() / 1000));
			}, 3000)();
		},
	};

	Player.init();
}
