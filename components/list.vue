<template>
	<v-layout column justify-center align-center>
		<v-card width="800" class="mx-auto" min-height="300px" :class="!show ? 'invisible' : ''">
			<v-toolbar>
				<v-toolbar-title :class="sortMethod === 0 ? 'selected' : ''" @click="sortMethod = 0">
					Aléatoire
				</v-toolbar-title>

				<v-toolbar-title :class="sortMethod === 1 ? 'selected' : ''" @click="sortMethod = 1">
					Dates
				</v-toolbar-title>

				<v-toolbar-title :class="sortMethod === 2 ? 'selected' : ''" @click="sortMethod = 2">
					Artistes
				</v-toolbar-title>

				<v-spacer></v-spacer>

				<v-text-field class="filterInput" v-model="filter" color="#ffffff" label="Rechercher"></v-text-field>

				<font-awesome-icon class="icon" v-if="!show" @click="show = true" icon="angle-double-down" />
				<font-awesome-icon class="icon" ref="" v-else @click="show = false" icon="angle-double-up" />
			</v-toolbar>

			<v-list v-if="show" max-height="500px" class="overflow-y-auto">
				<v-list-group v-for="(musics, key) in filtered" :key="key" no-action>
					<template v-slot:activator>
						<v-list-item-avatar v-if="sortMethod !== 1">
							<v-img :src="musics[0].img"></v-img>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title v-text="key"></v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list-item v-for="music in musics" :key="music.src" v-on:click="select(music)">
						<v-list-item-avatar>
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
		fullList: {},
		formatted: {},
		filtered: {},
		sortMethod: 0,
		show: false,
		filter: null
	}),

	async fetch() {
		this.fullList = await this.$axios.$get('http://localhost:3000/musics');
		this.formatted = this.fullList;

		this.genPlaylist(0);
		if (!this.getMusic) this.$store.commit('musics/setMusic', { ...this.getPlaylist[0], skip: true });
	},

	computed: {
		...mapGetters('colors', ['getColors']),
		...mapGetters('musics', ['getPlaylist', 'getMusic'])
	},

	watch: {
		sortMethod() {
			this.genPlaylist();
		},

		filter(value) {
			this.filterMusics();
		}
	},

	methods: {
		genPlaylist() {
			let playlist = [];

			switch (this.sortMethod) {
				case 0:
					for (const artist in this.fullList) playlist.push(...this.fullList[artist]);
					playlist = playlist
						.map(a => [Math.random(), a])
						.sort((a, b) => a[0] - b[0])
						.map(a => a[1]);

					this.formatted = this.fullList;
					break;

				case 1:
					const formater = new Intl.DateTimeFormat('fr-FR', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					});

					for (const artist in this.fullList) playlist.push(...this.fullList[artist]);

					playlist = playlist.sort((a, b) => a.date - b.date);
					this.formatted = playlist.reduce((acc, cur) => {
						const date = formater.format(new Date(cur.date));
						if (acc[date]) acc[date].push(cur);
						else acc[date] = [cur];

						return acc;
					}, {});
					break;

				case 2:
					for (const artist in this.fullList) playlist.push(...this.fullList[artist]);
					this.formatted = this.fullList;
					break;
			}

			this.filterMusics();

			this.$store.commit('musics/setPlaylist', playlist);
			if (this.getMusic) this.$store.commit('musics/setIndexToMusic', this.getMusic);
		},

		select(music) {
			this.$store.commit('musics/setMusic', music);
			this.genPlaylist();
		},

		filterMusics() {
			if (!this.filter) {
				this.filtered = this.formatted;
				return;
			}

			this.filter = this.filter.toLowerCase();
			this.filtered = Object.keys(this.formatted).reduce((acc, cur) => {
				if (this.sortMethod !== 1 && cur.toLowerCase().includes(this.filter)) acc[cur] = this.formatted[cur];
				else {
					for (const elem of this.formatted[cur]) {
						if (
							elem.title.toLowerCase().includes(this.filter) ||
							(this.sortMethod === 1 && elem.artist.toLowerCase().includes(this.filter))
						) {
							if (acc[cur]) acc[cur].push(elem);
							else acc[cur] = [elem];
						}
					}
				}
				return acc;
			}, {});
		}
	}
};
</script>

<style scoped lang="scss">
.v-toolbar {
	background-color: var(--mainColor) !important;
	user-select: none;
	width: 100%;

	div {
		cursor: pointer;
		width: 22%;
		display: inline-block;
		text-align: center;

		padding: 0 1rem;
		font-size: 1rem;

		&.selected {
			font-size: 1.8rem;
			font-weight: bold;
		}
	}

	.filterInput {
		max-width: 18%;
		padding-top: 25px;
		margin-right: 20px;
	}
}

.v-list-item--active .v-list-item__content {
	color: var(--mainColor) !important;
}

.icon {
	cursor: pointer;
}

.invisible {
	background-color: rgba(0, 0, 0, 0);
	box-shadow: unset;
}
</style>

<style lang="scss">
.v-list-item--link:before {
	background-color: var(--mainColor) !important;
}
</style>
