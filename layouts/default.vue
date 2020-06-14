<template>
	<v-app dark>
		<style>
			:root {
				--mainColor: {{ colors[0]}};
			}
		</style>

		<img id="bg" :src="src" />
		<nuxt keep-alive />
	</v-app>
</template>

<script>
import * as Vibrant from 'node-vibrant';

export default {
	data: () => ({
		src: '/img/default.png.blur',
		colors: ['#ff00ff']
	}),

	created() {
		this.$root.$on('trackCover', imgPath => {
			Vibrant.from(imgPath).getPalette((err, palette) => {
				this.$store.commit('colors/setColors', [palette.Vibrant.hex]);
				this.colors = [palette.Vibrant.hex];
			});

			this.src = `${imgPath}.blur`;
		});
	}
};
</script>

<style scoped>
#bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
