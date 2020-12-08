export const state = () => ({ colors: ['#ff00ff', '#00ffff'] });

export const getters = {
	getColors: state => {
		return state.colors;
	}
};

export const mutations = {
	setColors: (state, colors) => {
		state.colors = colors;
	}
};
