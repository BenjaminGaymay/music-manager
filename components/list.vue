<template>
	<v-layout column justify-center align-center>
		<v-card width="800" class="mx-auto">
			<v-toolbar>
				<v-toolbar-title>Artistes</v-toolbar-title>

				<v-radio-group v-model="sortMethod" row>
					<v-radio label="Artistes" :color="getColors[1]" value="0"></v-radio>
					<v-radio label="Dates" :color="getColors[1]" value="1"></v-radio>
					<v-radio label="Aléatoire" :color="getColors[1]" value="2"></v-radio>
				</v-radio-group>

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
import { mapMutations, mapGetters } from 'vuex';

export default {
	data: () => ({
		list: [],
		sortMethod: '0'
	}),

	async fetch() {
		this.list = await this.$axios.$get('http://localhost:3000/musics');
		this.genPlaylist();
		this.$store.commit('musics/setMusic', { ...this.getPlaylist[0], skip: true });
	},

	computed: {
		...mapGetters('colors', ['getColors']),
		...mapGetters('musics', ['getPlaylist'])
	},

	watch: {
		sortMethod() {
			this.genPlaylist();
		}
	},

	methods: {
		genPlaylist() {
			let playlist = [];

			switch (this.sortMethod) {
				case '0':
					for (const artist in this.list) playlist.push(...this.list[artist]);
					break;
				case '1':
					// date
					break;
				case '2':
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
			this.genPlaylist();

			this.$store.commit('musics/setMusic', music);
			this.$store.commit('musics/setIndex', this.getPlaylist.indexOf(music));
		}
	}
};
</script>

<style scoped>
.v-toolbar {
	background-color: var(--mainColor) !important;
}
</style>
