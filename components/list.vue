<template>
	<v-container column justify-center align-center>
		<v-card max-width="800px" class="mx-auto" min-height="300px">
			<v-toolbar :color="getColors[0]">
				<v-toolbar-title :class="sortMethod === null ? 'selected' : ''" @click="sortMethod = null">
					Aléatoire
				</v-toolbar-title>

				<v-toolbar-title :class="sortMethod === 'date' ? 'selected' : ''" @click="sortMethod = 'date'">
					Dates
				</v-toolbar-title>

				<v-toolbar-title :class="sortMethod === 'artist' ? 'selected' : ''" @click="sortMethod = 'artist'">
					Artistes
				</v-toolbar-title>

				<v-spacer></v-spacer>

				<v-text-field class="filterInput" v-model="filter" color="#ffffff" label="Rechercher"></v-text-field>
			</v-toolbar>

			<v-data-table
				hide-default-header
				hide-default-footer
				:single-select="false"
				v-model="selected"
				:headers="[
					{ text: 'Couverture', value: 'img', filterable: false },
					{ text: 'Titre', value: 'title' },
					{ text: 'Artiste', value: 'artist' }
				]"
				:items="playlist"
				item-key="src"
				:search="filter"
				:custom-sort="customSort"
				:group-by="sortMethod"
				:page.sync="page"
				@page-count="pageCount = $event"
			>
				<template v-if="sortMethod !== null" v-slot:group.header="{ items, isOpen }">
					<th :style="{ backgroundColor: getColors[1] }" colspan="100%" @click="toggle(items[0])">
						<v-btn text icon small color="white">
							<v-icon>{{
								(sortMethod === 'artist' && items[0].artist === selectedGroup.key) ||
								(sortMethod === 'date' && items[0].date === selectedGroup.key)
									? 'mdi-minus'
									: 'mdi-plus'
							}}</v-icon>
						</v-btn>
						<span class="mx-2 subtitle-1">
							{{ sortMethod === 'artist' ? items[0].artist : items[0].date }}
						</span>
					</th>
				</template>

				<template slot="item" slot-scope="props">
					<tr
						v-if="!selectedGroup.group || props.item[selectedGroup.group] === selectedGroup.key"
						@click="select(props.item)"
						:style="
							props.item.title === getMusic.title && props.item.artist === getMusic.artist
								? { backgroundColor: getColors[1] }
								: {}
						"
						:class="
							props.item.title === getMusic.title && props.item.artist === getMusic.artist
								? 'v-data-table__selected'
								: ''
						"
					>
						<td>
							<v-list-item-avatar>
								<v-img :src="props.item.img" />
							</v-list-item-avatar>
						</td>

						<td>{{ props.item.title }} - {{ props.item.artist }}</td>

						<td>
							<div style="min-width: 40px; width: 40px">
								<v-img
									v-if="
										isPlaying &&
											props.item.title === getMusic.title &&
											props.item.artist === getMusic.artist
									"
									max-height="30%"
									width="30px"
									src="img/playing.svg"
								></v-img>
							</div>
						</td>
					</tr>
				</template>
			</v-data-table>

			<div class="text-center pt-2">
				<v-pagination
					v-model="page"
					:length="pageCount"
					:total-visible="7"
					:color="getColors[0]"
				></v-pagination>
			</div>
		</v-card>
	</v-container>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
	data: () => ({
		fullList: [],
		sortMethod: null,
		filter: '',
		playlist: [],
		selected: [],
		page: 1,
		pageCount: 0,
		itemsPerPage: 10,
		selectedGroup: { group: null, key: null }
	}),

	async fetch() {
		this.fullList = await this.$axios.$get('https://benjamin-gaymay.eu/musiques/list');

		this.genPlaylist();
	},

	computed: {
		...mapGetters('colors', ['getColors']),
		...mapGetters('musics', ['getPlaylist', 'getMusic', 'getIndex', 'isPlaying'])
	},

	watch: {
		sortMethod() {
			this.genPlaylist();

			this.$store.commit('musics/setIndexToMusic', this.getMusic);

			if (this.sortMethod === 'artist') this.selectedGroup = { group: 'artist', key: this.getMusic.artist };
			else if (this.sortMethod === 'date') this.selectedGroup = { group: 'date', key: this.getMusic.date };
		},

		getIndex(index) {
			this.filter = '';
			this.selected = [this.playlist[index]];
			this.page = Math.ceil((index + 1) / this.itemsPerPage);

			if (this.sortMethod === 'artist') this.selectedGroup = { group: 'artist', key: this.getMusic.artist };
			else if (this.sortMethod === 'date') {
				this.selectedGroup = { group: 'date', key: this.getMusic.date };
				this.page = Math.ceil((this.playlist.length - index + 1) / this.itemsPerPage);
			}
		},

		filter(value) {
			if (value) {
				value = value.toLowerCase();
				const length = this.playlist.filter(
					e => e.title.toLowerCase().includes(value) || e.artist.toLowerCase().includes(value)
				).length;

				this.page = 1;
			} else {
				this.page = Math.ceil((this.getIndex + 1) / this.itemsPerPage);
			}
		}
	},

	methods: {
		genPlaylist() {
			this.playlist = [];

			switch (this.sortMethod) {
				case null:
					for (const artist in this.fullList) this.playlist.push(...this.fullList[artist]);
					this.playlist = this.playlist
						.map(a => [Math.random(), a])
						.sort((a, b) => a[0] - b[0])
						.map(a => a[1]);

					break;

				case 'date':
					for (const artist in this.fullList) this.playlist.push(...this.fullList[artist]);
					this.playlist = this.playlist.sort((a, b) => a.timestamp - b.timestamp);

					break;

				case 'artist':
					for (const artist in this.fullList) this.playlist.push(...this.fullList[artist]);
					break;
			}

			this.selectedGroup = { group: this.sortMethod, key: null };

			this.$store.commit('musics/setPlaylist', this.playlist);

			if (this.getMusic) this.$store.commit('musics/setIndexToMusic', this.getMusic);
			else this.$store.commit('musics/setMusic', { ...this.playlist[0], skip: true });
		},

		select(music) {
			this.$store.commit('musics/setMusic', music);
			this.$store.commit('musics/setIndexToMusic', this.getMusic);
		},

		toggle(item) {
			const select = { group: this.sortMethod, key: this.sortMethod === 'artist' ? item.artist : item.date };

			if (this.selectedGroup.key !== select.key || this.selectedGroup.group !== select.group) {
				this.selectedGroup = select;
			} else this.selectedGroup = { group: this.sortMethod, key: null };
		},

		customSort(items, index, isDesc) {
			if (this.sortMethod === 'date') items.sort((a, b) => b.timestamp - a.timestamp);
			return items;
		}
	}
};
</script>

<style scoped lang="scss">
.v-toolbar {
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

.icon {
	cursor: pointer;
}
</style>

<style lang="scss">
.v-data-table__wrapper {
	min-height: 300px;
}

.v-pagination__navigation {
	// background-color: var(--mainColor) !important;
}
</style>
