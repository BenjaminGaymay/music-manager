<template>
	<v-layout column justify-center align-center>
		<quicklist class="list" />
		<player class="player" />
		<tags />
	</v-layout>
</template>

<script>
import quicklist from '~/components/quicklist.vue';
import player from '~/components/player.vue';
import tags from '~/components/tags.vue';

import { mapGetters } from 'vuex';

export default {
	components: {
		quicklist,
		player,
		tags
	},

	head() {
		return {
			title: this.title
			// link: [{ hid: 'icon', rel: 'icon', type: 'image/jpg', href: this.cover }]
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
