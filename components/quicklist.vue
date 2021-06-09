<template>
	<v-card :style="{ backgroundColor: getColors[0] }" class="mx-auto" min-width="300px" width="min(400px, 90%)">
		<v-toolbar dense tile :color="getColors[0]" class="mx-auto">
			<v-toolbar-title style="cursor: pointer" :class="!tagged ? 'font-weight-bold' : ''" @click="getUntagged">
				Ajouts
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-toolbar-title style="cursor: pointer" :class="tagged ? 'font-weight-bold' : ''" @click="getTagged">
				Corrections
			</v-toolbar-title>
		</v-toolbar>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data: () => ({
		playlist: [],
		tagged: false
	}),

	async fetch() {
		await this.getUntagged();
	},

	computed: {
		...mapGetters('colors', ['getColors']),
		...mapGetters('musics', ['getPlaylist', 'getMusic', 'getIndex', 'isPlaying'])
	},

	methods: {
		genPlaylist() {
			this.playlist = this.playlist
				.map(a => [Math.random(), a])
				.sort((a, b) => a[0] - b[0])
				.map(a => a[1]);

			this.$store.commit('musics/setPlaylist', this.playlist);

			if (this.playlist.length > 0) this.$store.commit('musics/setMusic', { ...this.playlist[0], skip: true });
			else this.$store.commit('musics/setMusic', null);
		},

		async getUntagged() {
			this.tagged = false;
			this.playlist = await this.$axios.$get('/untagged');

			this.genPlaylist();
		},

		async getTagged() {
			this.tagged = true;
			this.playlist = await this.$axios.$get('/tagged');

			this.genPlaylist();
		}
	}
};
</script>

<style scoped lang="scss"></style>
