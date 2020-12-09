export const state = () => ({ colors: ['#2E2E2E', '#444444'] });

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
