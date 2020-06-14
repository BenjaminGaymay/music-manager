<template>
	<div>
		<audio
			v-show="null"
			ref="player"
			:src="musicSrc"
			v-on:ended="nextTrack({ skip: false })"
			v-on:play="toggle(true)"
			v-on:pause="toggle(false)"
			v-on:timeupdate="updateProgression"
			controls
		></audio>

		<v-card v-if="musicSrc" class="mx-auto" max-width="300px">
			<v-img height="300px" width="300px" :src="music.img"> </v-img>

			<v-card-title>{{ music.title }}</v-card-title>
			<v-card-subtitle>{{ music.artist }}</v-card-subtitle>

			<v-sheet class="progress" v-bind:style="{ width: progression + '%' }"></v-sheet>

			<v-card-actions>
				<v-btn v-on:click="previousTrack" text> ⏪︎ </v-btn>
				<v-btn v-on:click="playPause" text> {{ playIcon }} </v-btn>
				<v-btn v-on:click="nextTrack({ skip: true })" text> ⏩︎ </v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			playlist: this.$store.state.musics.playlist,
			index: this.$store.state.musics.index,
			musicSrc: null,
			playing: false,
			progression: 0
		};
	},

	created() {
		this.$root.$on('changeMusic', newMusic => {
			this.index = this.playlist.indexOf(newMusic);
			this.$store.commit('musics/setIndex', this.index);
			this.$root.$emit('trackCover', newMusic.img);

			if (!this.$refs.player.paused) this.$nextTick(() => this.$refs.player.play());
		});
	},

	mounted() {
		this.$refs.player.volume = 0.05;
		this.musicSrc = this.playlist[this.index].src;

		this.$root.$emit('trackCover', this.playlist[this.index].img);
	},

	computed: {
		music() {
			this.musicSrc = this.playlist[this.index].src;

			this.$root.$emit('trackCover', this.playlist[this.index].img);
			return this.playlist[this.index];
		},

		playIcon() {
			return this.playing ? '⏸' : '▶️';
		}
	},

	methods: {
		toggle(state) {
			this.playing = state;
		},

		playPause() {
			this.playing = !this.playing;
			this.playing ? this.$refs.player.play() : this.$refs.player.pause();
		},

		nextTrack({ skip }) {
			this.progression = 0;
			this.index = (this.index + 1) % this.playlist.length;
			this.$store.commit('musics/setIndex', this.index);

			if (!skip || !this.$refs.player.paused) this.$nextTick(() => this.$refs.player.play());
			if (!skip) this.playing = true;
		},

		previousTrack() {
			this.progression = 0;
			this.index = this.index - 1 >= 0 ? this.index - 1 : this.playlist.length - 1;
			this.$store.commit('musics/setIndex', this.index);

			if (!this.$refs.player.paused) this.$nextTick(() => this.$refs.player.play());
		},

		updateProgression() {
			this.progression = (this.$refs.player.currentTime / this.$refs.player.duration) * 100;
		}
	}
};
</script>

<style scoped>
.progress {
	width: 0;
	height: 0.5rem;
	background-color: var(--mainColor);
}

.v-btn {
	color: var(--mainColor);
}
</style>
