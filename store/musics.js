export const state = () => ({ playlist: [], index: 0, music: null, playing: false });

export const getters = {
	getPlaylist: state => {
		return state.playlist;
	},

	getIndex: state => {
		return state.index;
	},

	getMusic: state => {
		return state.music;
	},

	isPlaying: state => {
		return state.playing;
	}
};

export const mutations = {
	setPlaylist(state, playlist) {
		state.playlist = playlist;
	},

	setIndex(state, index) {
		state.index = index;
	},

	setMusic(state, music) {
		state.music = music;
	},

	setIndexToMusic(state, music) {
		for (const i in state.playlist) {
			if (state.playlist[i].title === music.title && state.playlist[i].artist === music.artist) {
				state.index = Number.parseInt(i);
				break;
			}
		}
	},

	toggle(state, playing) {
		state.playing = playing;
	}
};
