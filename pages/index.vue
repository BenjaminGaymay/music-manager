<template>
	<v-layout column justify-center align-center>
		<player />
		<list />
	</v-layout>
</template>

<script>
import list from '~/components/list.vue';
import player from '~/components/player.vue';

export default {
	components: {
		list,
		player
	}
};
</script>
