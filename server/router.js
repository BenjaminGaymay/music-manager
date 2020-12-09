const fs = require('fs');
const { Router } = require('express');
const router = Router();

const listMusics = directory => {
	return fs.readdirSync(directory).reduce((a, v) => {
		try {
			let musics = fs.readdirSync(`${directory}/${v}`);

			musics = musics.filter(m => m.endsWith('.mp3'));
			a[v] = musics.map(e => ({
				src: `musics/${v}/${e}`.replace('%', '%25'),
				img: fs.existsSync(`${directory}/${v}/${e}`.replace(/\.mp3$/, '.jpg'))
					? `musics/${v}/${e}`.replace(/\.mp3$/, '.jpg').replace('%', '%25')
					: '/img/default.png',
				blur: fs.existsSync(`${directory}/${v}/${e}`.replace(/\.mp3$/, '.jpg.blur'))
					? `musics/${v}/${e}`.replace(/\.mp3$/, '.jpg.blur').replace('%', '%25')
					: '/img/default.png.blur',
				artist: v,
				title: e.match(/^.+ - (.+)\.mp3$/)[1],
				date: fs.statSync(`${directory}/${v}/${e}`).mtime.getTime()
			}));
		} catch (e) {}

		return a;
	}, {});
};

// const musics = listMusics(`${__dirname}/../static/musics`);
const musics = listMusics(`D:\\Musiques`);

module.exports = () => {
	router.get('/', (req, res) => {
		res.json(musics);
	});

	return router;
};
