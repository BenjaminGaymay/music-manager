<template>
	<v-app dark>
		<style v-if="getMusic">
			:root {
				--mainColor: {{ getColors[0]}};
				--secondaryColor: {{ getColors[1]}};
			}
		</style>

		<img id="bg" v-if="getMusic" :src="getMusic.blur" />

		<!-- <div>
			<div class="rect"></div>
			<div class="rect"></div>
			<div class="rect"></div>
			<div class="rect"></div>
			<div class="rect"></div>
			<div class="rect"></div>
		</div> -->

		<nuxt keep-alive />
	</v-app>
</template>

<script>
import * as Vibrant from 'node-vibrant';
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters('musics', ['getMusic']),
		...mapGetters('colors', ['getColors'])
	},

	watch: {
		getMusic(music) {
			Vibrant.from(music.img).getPalette((err, palette) => {
				this.$store.commit('colors/setColors', [palette.Vibrant.hex, palette.DarkVibrant.hex]);

				// document.getElementsByClassName('rect')[0].style.backgroundColor = palette.Vibrant.hex;
				// document.getElementsByClassName('rect')[0].innerHTML = 'palette.Vibrant.hex';
				// document.getElementsByClassName('rect')[1].style.backgroundColor = palette.Muted.hex;
				// document.getElementsByClassName('rect')[1].innerHTML = 'palette.Muted.hex';
				// document.getElementsByClassName('rect')[2].style.backgroundColor = palette.DarkVibrant.hex;
				// document.getElementsByClassName('rect')[2].innerHTML = 'palette.DarkVibrant.hex';
				// document.getElementsByClassName('rect')[3].style.backgroundColor = palette.DarkMuted.hex;
				// document.getElementsByClassName('rect')[3].innerHTML = 'palette.DarkMuted.hex';
				// document.getElementsByClassName('rect')[4].style.backgroundColor = palette.LightVibrant.hex;
				// document.getElementsByClassName('rect')[4].innerHTML = 'palette.LightVibrant.hex';
				// document.getElementsByClassName('rect')[5].style.backgroundColor = palette.LightMuted.hex;
				// document.getElementsByClassName('rect')[5].innerHTML = 'palette.LightMuted.hex';
			});
		}
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

/* .rect {
	height: 30px;
	z-index: -1;
} */
</style>
