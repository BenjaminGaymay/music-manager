<template>
	<v-app :style="background" dark>
		<!-- <style>
			:root {
				--mainColor: {{ getColors[0] }};
				--secondaryColor: {{ getColors[1] }};

				background-size: 100% 100%;
			}
		</style> -->
		<!-- background-image: url("{{ getMusic ? getMusic.blur : 'musiques/img/default.png.blur' }}"); -->

		<!-- <img id="bg" v-if="getMusic" :src="getMusic.blur" /> -->

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
		...mapGetters('musics', ['getMusic'])
	},

	data() {
		return {
			background: {
				backgroundSize: '100% 100%',
				backgroundImage: `url('/musiques/img/default.png.blur')`
			}
		};
	},

	mounted() {
		this.backgroundAndColors(this.getMusic);
	},

	watch: {
		getMusic(music) {
			if (music) this.backgroundAndColors(music);
		}
	},

	methods: {
		backgroundAndColors(music) {
			if (!music) return;

			this.background.backgroundImage = `url('${music.blur}')`;

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
/* .rect {
	height: 30px;
	z-index: -1;
} */
</style>
