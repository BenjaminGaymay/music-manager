<template>
	<div>
		<audio
			v-show="null"
			ref="player"
			:src="getMusic ? getMusic.src : ''"
			v-on:ended="nextTrack({ skip: false })"
			v-on:play="toggle(true)"
			v-on:pause="toggle(false)"
			v-on:timeupdate="updateProgression"
			controls
		></audio>

		<v-card class="mx-auto" max-width="300px">
			<v-img height="300px" width="300px" :src="getMusic ? getMusic.img : 'musiques/img/default.png'">
				<v-tooltip v-model="showTooltip" right>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							fab
							x-small
							id="share"
							:color="getColors[1]"
							@click="share"
							v-bind="attrs"
							v-on="showTooltip ? on : null"
						>
							<font-awesome-icon icon="share-alt" />
						</v-btn>
					</template>
					<span>Copié dans le presse-papier</span>
				</v-tooltip>
			</v-img>

			<v-card-title>{{ getMusic ? getMusic.title : '' }}</v-card-title>
			<v-card-subtitle>{{ getMusic ? getMusic.artist : '' }}</v-card-subtitle>

			<div class="progress-container" @click="setProgression">
				<v-sheet
					class="progress"
					rounded
					v-bind:style="{ width: progression + '%', backgroundColor: getColors[0] }"
				></v-sheet>
			</div>

			<v-card-actions style="position: relative">
				<v-btn :color="getColors[0]" v-on:click="previousTrack" text>
					<font-awesome-icon icon="backward" />
				</v-btn>
				<v-btn :color="getColors[0]" v-on:click="playPause" text>
					<font-awesome-icon v-if="playing" icon="pause" /> <font-awesome-icon v-else icon="play" />
				</v-btn>

				<v-btn :color="getColors[0]" v-on:click="nextTrack({ skip: true })" text>
					<font-awesome-icon icon="forward" />
				</v-btn>

				<!-- <v-btn v-on:click="showVolume = !showVolume" text>
					<font-awesome-icon v-if="!showVolume && volume > 50" icon="volume-up" />
					<font-awesome-icon v-if="!showVolume && volume <= 50 && volume > 0" icon="volume-down" />
					<font-awesome-icon v-if="!showVolume && volume === 0" icon="volume-mute" />

					<v-slider
						v-if="showVolume"
						v-model="volume"
						v-on:change="setVolume"
						color="var(--mainColor)"
						class="volume"
						min="0"
						max="100"
						vertical
					></v-slider>
				</v-btn> -->
				<v-btn :color="getColors[0]" v-on:click="setVolume(volume === 0 ? 10 : volume === 10 ? 50 : 0)" text>
					<font-awesome-icon v-if="volume === 50" icon="volume-up" />
					<font-awesome-icon v-if="volume === 10" icon="volume-down" />
					<font-awesome-icon v-if="volume === 0" icon="volume-mute" />
				</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			playing: false,
			progression: 0,
			volume: 10,
			showVolume: false,
			showTooltip: false
		};
	},

	mounted() {
		this.setVolume();
	},

	computed: {
		...mapGetters('musics', ['getPlaylist', 'getIndex', 'getMusic']),
		...mapGetters('colors', ['getColors'])
	},

	watch: {
		getIndex() {
			if (this.getMusic) this.setMedia(this.getMusic);
		},

		getMusic() {
			if (!this.getMusic) return;

			if (!this.getMusic.skip || !this.$refs.player.paused) this.$nextTick(() => this.$refs.player.play());
			if (!this.getMusic.skip) this.playing = true;
		}
	},

	methods: {
		toggle(state) {
			this.playing = state;
			this.$store.commit('musics/toggle', this.playing);
		},

		playPause() {
			if (!this.getMusic) return;

			this.playing = !this.playing;
			this.playing ? this.$refs.player.play() : this.$refs.player.pause();
			this.$store.commit('musics/setPlaying', this.playing);
		},

		nextTrack({ skip }) {
			if (this.getPlaylist.length === 0) return;

			const index = (this.getIndex + 1) % this.getPlaylist.length;

			this.progression = 0;
			this.$store.commit('musics/setIndex', index);
			this.$store.commit('musics/setMusic', { ...this.getPlaylist[index], skip });
		},

		previousTrack() {
			if (this.getPlaylist.length === 0) return;

			const index = this.getIndex - 1 >= 0 ? this.getIndex - 1 : this.getPlaylist.length - 1;

			this.progression = 0;
			this.$store.commit('musics/setIndex', index);
			this.$store.commit('musics/setMusic', { ...this.getPlaylist[index], skip: true });
		},

		updateProgression() {
			if (!this.getMusic) return;

			try {
				this.progression = (this.$refs.player.currentTime / this.$refs.player.duration) * 100;
			} catch (e) {
				console.log(e);
			}
		},

		setProgression(event) {
			if (!this.getMusic) return;

			const offsetWidth = event.srcElement.classList.contains('v-sheet')
				? event.srcElement.offsetParent.offsetWidth
				: event.srcElement.offsetWidth;

			const position = (event.offsetX / offsetWidth) * 100;

			this.$refs.player.currentTime = (position / 100) * this.$refs.player.duration;
		},

		setVolume(volume) {
			if (volume !== undefined) this.volume = volume;
			this.$refs.player.volume = this.volume / 100;
		},

		share() {
			if (!this.getMusic) return;

			const url = `https://${location.host}${location.pathname}?artist=${this.getMusic.artist}&title=${this.getMusic.title}`;

			if (window.isSecureContext) {
				navigator.clipboard.writeText(url);
				this.showTooltip = true;
			}
		},

		setMedia(music) {
			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: music.title,
					artist: music.artist,
					artwork: [
						{ src: music.img, sizes: '96x96', type: 'image/jpg' },
						{ src: music.img, sizes: '128x128', type: 'image/jpg' },
						{ src: music.img, sizes: '192x192', type: 'image/jpg' },
						{ src: music.img, sizes: '256x256', type: 'image/jpg' },
						{ src: music.img, sizes: '384x384', type: 'image/jpg' },
						{ src: music.img, sizes: '512x512', type: 'image/jpg' }
					]
				});

				navigator.mediaSession.setActionHandler('play', this.playPause);
				navigator.mediaSession.setActionHandler('pause', this.playPause);

				navigator.mediaSession.setActionHandler('seekto', to => (this.$refs.player.currentTime = to.seekTime));

				navigator.mediaSession.setActionHandler('previoustrack', this.previousTrack);
				navigator.mediaSession.setActionHandler('nexttrack', this.nextTrack);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.progress-container {
	position: relative;
	height: 1rem;
	cursor: pointer;

	.progress {
		position: absolute;
		top: calc(50% - 0.25rem);

		width: 0;
		height: 0.5rem;
	}
}

.volume {
	position: absolute;
	margin-top: -1.5rem;
	// bottom: 0;

	// transform: translate(10%);
	// right: 2rem;
}

.v-btn {
	&#share {
		position: absolute;
		top: 5px;
		right: 5px;
	}
}
</style>

<style scoped>
.volume >>> .v-slider {
	min-height: 4rem;
}
</style>
