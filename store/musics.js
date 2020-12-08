export const state = () => ({ playlist: [], index: 0, music: null });

export const getters = {
	getPlaylist: state => {
		return state.playlist;
	},

	getIndex: state => {
		return state.index;
	},

	getMusic: state => {
		return state.music;
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
	}
};
