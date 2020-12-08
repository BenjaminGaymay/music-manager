<template>
	<v-layout column justify-center align-center>
		<player class="player" />
		<list />
	</v-layout>
</template>

<script>
import list from '~/components/list.vue';
import player from '~/components/player.vue';

import { mapGetters } from 'vuex';

export default {
	components: {
		list,
		player
	},

	head() {
		return {
			title: this.title,
			link: [
				{
					rel: 'icon',
					type: 'image/jpg',
					href: this.cover
				}
			]
		};
	},

	computed: {
		...mapGetters('musics', ['getPlaylist', 'getMusic']),

		title() {
			const music = this.getMusic;

			return music ? `${music.title} - ${music.artist}` : '';
		},

		cover() {
			const music = this.getMusic;

			return music ? this.getMusic.img : '/img/default.png';
		}
	},

	mounted() {
		if (this.$route.query.artist && this.$route.query.title) {
			console.log(this.$route.query.title);
			this.findTrackInPlaylist(this.$route.query.title, this.$route.query.artist);
		}
	},

	methods: {
		findTrackInPlaylist(title, artist) {
			const playlist = this.getPlaylist;

			for (const i in playlist) {
				if (playlist[i].title === title && playlist[i].artist === artist) {
					this.$store.commit('musics/setMusic', { ...playlist[i], skip: true });
					this.$store.commit('musics/setIndex', Number.parseInt(i));
					break;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.player {
	margin-top: 1rem;
}
</style>
