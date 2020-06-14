export const state = () => ({ playlist: [], index: 0 });

export const mutations = {
	setPlaylist(state, playlist) {
		state.index = 0;
		state.playlist = playlist;
	},

	setIndex(state, index) {
		state.index = index;
	}
};

// export const actions = {
// 	async request({ commit }) {
// 		if (state.list !== null) return state.list;

// 		commit('request');
// 	}
// };
