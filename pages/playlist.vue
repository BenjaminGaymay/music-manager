<template>
	<v-layout column justify-center align-center>
		<player class="player" />
		<setPlaylist />
		<list class="list" :tags="true" />
	</v-layout>
</template>

<script>
import list from '~/components/list.vue';
import player from '~/components/player.vue';
import setPlaylist from '~/components/setPlaylist.vue';

import { mapGetters } from 'vuex';

export default {
	components: {
		list,
		player,
		setPlaylist
	},

	head() {
		return {
			title: this.title
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
.player,
.list {
	margin-top: 1rem;
	margin-bottom: 1rem;
}
</style>
