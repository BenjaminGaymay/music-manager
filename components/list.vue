<template>
	<v-layout column justify-center align-center>
		<v-card width="800" class="mx-auto">
			<v-toolbar>
				<v-toolbar-title>Musiques</v-toolbar-title>

				<v-spacer></v-spacer>
			</v-toolbar>

			<v-list>
				<v-list-group v-for="(musics, artist) in list" :key="artist" no-action>
					<template v-slot:activator>
						<v-list-item-content>
							<v-list-item-title v-text="artist"></v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list-item v-for="music in musics" :key="music.src" v-on:click="select(music)">
						<v-list-item-avatar class="mr-12">
							<v-img :src="music.img"></v-img>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title v-text="music.title"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-group>
			</v-list>
		</v-card>
	</v-layout>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	data: () => ({
		list: [],
		sortMethod: 2
	}),

	async fetch() {
		this.list = await this.$axios.$get('http://localhost:3000/musics');
		this.genPlaylist();
	},

	computed: {
		colors() {
			return this.$store.state.colors.colors;
		}
	},

	methods: {
		genPlaylist() {
			let playlist = [];

			switch (this.sortMethod) {
				case 0:
					for (const artist in this.list) playlist.push(...this.list[artist]);
					break;
				case 1:
					// date
					break;
				case 2:
					for (const artist in this.list) playlist.push(...this.list[artist]);
					playlist = playlist
						.map(a => [Math.random(), a])
						.sort((a, b) => a[0] - b[0])
						.map(a => a[1]);
					break;
			}

			this.$store.commit('musics/setPlaylist', playlist);
		},

		select(music) {
			this.$root.$emit('changeMusic', music);
		}
	}
};
</script>

<style scoped>
.v-toolbar {
	background-color: var(--mainColor) !important;
}
</style>
