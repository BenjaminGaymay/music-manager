<template>
	<v-chip-group class="set-tag-container mx-auto" column center-active>
		<v-chip
			v-for="tag in items"
			:key="tag"
			:style="{ backgroundColor: tag === selected ? getColors[1] : getColors[0] }"
			@click="selectTag(tag)"
		>
			{{ tag }}
		</v-chip>
	</v-chip-group>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return { selected: '', items: [], playlist: null };
	},

	async fetch() {
		this.items = await this.$axios.$get('/availableTags');
		// this.selected = this.items[Math.floor(Math.random() * this.items.length)];
	},

	computed: {
		...mapGetters('colors', ['getColors'])
	},

	methods: {
		selectTag(tag) {
			this.selected = tag;
			this.$store.commit('musics/setTag', tag);
		}
	}
};
</script>

<style lang="scss">
.set-tag-container {
	min-width: 300px;
	width: min(900px, 90%);

	.v-slide-group__content {
		justify-content: center;
	}
}
</style>
