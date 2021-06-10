export const state = () => ({ playlist: [], index: 0, music: null, playing: false, tag: null });

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

	getTag: state => {
		return state.tag;
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

	setPlaying(state, playing) {
		state.playing = playing;
	},

	setIndexToMusic(state, music) {
		for (const i in state.playlist) {
			if (state.playlist[i].title === music.title && state.playlist[i].artist === music.artist) {
				state.index = Number.parseInt(i);
				return;
			}
		}

		state.index = 0;
		state.music = state.playlist.length > 0 ? state.playlist[0] : null;
	},

	setTag(state, tag) {
		state.tag = tag;
	},

	toggle(state, playing) {
		state.playing = playing;
	}
};
