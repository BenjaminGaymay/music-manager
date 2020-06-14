export const state = () => ({ colors: ['#ff00ff'] });

export const mutations = {
	setColors(state, colors) {
		state.colors = colors;
	}
};
