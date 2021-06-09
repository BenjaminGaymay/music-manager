<template>
	<v-combobox
		:style="{ maxWidth: '600px', minWidth: '300px', width: '100%' }"
		class="mx-auto mt-4"
		v-model="tags"
		:items="items"
		multiple
		small-chips
		solo
		@change="add"
	>
		<template v-slot:selection="data">
			<v-chip
				:key="JSON.stringify(data.item)"
				v-bind="data.attrs"
				:input-value="data.selected"
				:disabled="data.disabled"
				close
				:style="{ backgroundColor: getColors[0] }"
				@click:close="remove(data.item)"
			>
				{{ data.item }}
			</v-chip>
		</template>
	</v-combobox>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return { prevTags: [], tags: [], items: [] };
	},

	async fetch() {
		this.items = await this.$axios.$get('/availableTags');
		console.log(this.items);
	},

	computed: {
		...mapGetters('musics', ['getPlaylist', 'getIndex', 'getMusic']),
		...mapGetters('colors', ['getColors'])
	},

	watch: {
		getMusic() {
			this.tags = this.getMusic ? this.getMusic.tags : [];
			this.prevTags = this.tags;
		}
	},

	methods: {
		remove(tag) {
			if (!this.getMusic) return;

			const index = this.tags.indexOf(tag);

			if (index >= 0) {
				this.tags.splice(index, 1);

				this.$axios.$delete('/tag', {
					data: { artist: this.getMusic.artist, src: this.getMusic.src, tag: tag }
				});
			}

			this.prevTags = this.tags;
		},

		add() {
			if (!this.getMusic) return;

			const newTags = this.tags.filter(e => !this.prevTags.includes(e));

			if (newTags.length > 0) {
				const tag = newTags[0];

				if (!this.items.includes(tag)) this.items.push(tag);
				this.$axios.$put('/tag', { artist: this.getMusic.artist, src: this.getMusic.src, tag: tag });
			}

			this.prevTags = this.tags;
		}
	}
};
</script>

<style lang="scss" scoped></style>
