// requests
// --------
const request = (url) => fetch(url).then((res) => res.json());
const station = "https://media.money4you.financial:8032/api/station/1";
const nowplaying = "https://media.money4you.financial:8032/api/nowplaying";

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

// main
// ----
const Player = {
	getStation: request(station),
	getNowplaying: request(nowplaying),

	play: () => {
		playerBtnPlay.addEventListener("click", () => {
			playerAudio.paused ? playerAudio.play() : playerAudio.pause();
		});
	},

	init: async function fn() {
		this.data = await this.getStation.then((res) => res);
		this.title = await this.getNowplaying.then(
			(res) => res[0].now_playing.song.text
		);
		this.art = await this.getNowplaying.then(
			(res) => res[0].now_playing.song.art
		);
		this.track = await this.getStation.then((res) => res.listen_url);
		this.station = await this.getStation.then((res) => res.name);

		console.log(this.data);

		const start = () => {
			playerImage.innerHTML = playerImageTemp.replace("%src%", this.art);
			playerTitle.innerHTML = playerTextTemp.replace("%text%", this.title);
			playerArtist.innerHTML = playerTextTemp.replace("%text%", "Artist");
			playerAudio.innerHTML = playerAudioTemp.replace("%src%", this.track);

			this.play();
		};
		start();
	},
};

Player.init();
