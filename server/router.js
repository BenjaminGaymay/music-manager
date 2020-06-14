const fs = require('fs');
const { Router } = require('express');
const router = Router();

const listMusics = directory => {
	return fs.readdirSync(directory).reduce((a, v) => {
		let musics = fs.readdirSync(`${directory}/${v}`);

		musics = musics.filter(m => m.endsWith('.mp3'));
		a[v] = musics.map(e => ({
			src: `musics/${v}/${e}`,
			img: `musics/${v}/${e}`.replace(/\.mp3$/, '.jpg'),
			artist: v,
			title: e.match(/^.+ - (.+)\.mp3$/)[1]
		}));

		return a;
	}, {});
};

const musics = listMusics(`${__dirname}/../static/musics`);

module.exports = () => {
	router.get('/', (req, res) => {
		res.json(musics);
	});

	return router;
};
