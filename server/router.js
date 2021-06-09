const fs = require('fs');
const { Router } = require('express');
const router = Router();

const listMusics = directory => {
	const formatter = new Intl.DateTimeFormat('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const tags = JSON.parse(fs.readFileSync('tags.json', { encoding: 'utf8', flag: 'r' }));

	return fs.readdirSync(directory).reduce((a, v) => {
		try {
			let musics = fs.readdirSync(`${directory}/${v}`);

			musics = musics.filter(m => m.endsWith('.mp3'));
			a[v] = musics.map(e => ({
				src: `/musiques/musics/${v}/${e}`.replace('%', '%25'),
				img: fs.existsSync(`${directory}/${v}/${e}`.replace(/\.mp3$/, '.jpg'))
					? `/musiques/musics/${v}/${e}`.replace(/\.mp3$/, '.jpg').replace('%', '%25')
					: '/musiques/img/default.png',
				blur: fs.existsSync(`${directory}/${v}/${e}`.replace(/\.mp3$/, '.jpg.blur'))
					? `/musiques/musics/${v}/${e}`.replace(/\.mp3$/, '.jpg.blur').replace('%', '%25')
					: '/musiques/img/default.png.blur',
				artist: v,
				title: e.match(/^.+ - (.+)\.mp3$/)[1],
				timestamp: fs.statSync(`${directory}/${v}/${e}`).mtime.getTime(),
				date: formatter.format(new Date(fs.statSync(`${directory}/${v}/${e}`).mtime.getTime())),
				tags: [...new Set(tags[`/musiques/musics/${v}/${e}`])] || []
			}));
		} catch (e) {}

		return a;
	}, {});
};

const musics = listMusics(`${__dirname}/../static/musics`);

setInterval(() => {
	let playlist = [];
	for (const artist in musics) playlist.push(...musics[artist]);
	playlist = playlist.sort((a, b) => a.timestamp - b.timestamp).reverse();

	fs.writeFileSync(
		'tags.json',
		JSON.stringify(
			playlist.reduce((acc, cur) => {
				acc[cur.src.replace('%25', '%')] = cur.tags;
				return acc;
			}, {})
		)
	);
}, 900000);

module.exports = () => {
	router.get('/list', (req, res) => {
		res.json(musics);
	});

	router.get('/untagged', (req, res) => {
		let playlist = [];
		for (const artist in musics) {
			for (music of musics[artist]) if (music.tags.length === 0) playlist.push(music);
		}

		res.json(playlist);
	});

	router.get('/tagged', (req, res) => {
		let playlist = [];
		for (const artist in musics) {
			for (music of musics[artist]) if (music.tags.length > 0) playlist.push(music);
		}

		res.json(playlist);
	});

	router.get('/availableTags', (req, res) => {
		let tags = new Set([
			'rock doux',
			'rock/métal',
			'dubstep',
			'pop',
			'électro',
			'électro pop',
			'électro douce',
			'électro instrumentale',
			'punk/rock',
			'chill',
			'passe-partout',
			'coups de cœur',
			'classique (rock)',
			'classique (rap)',
			'classique (pop)',
			'classique (électro)',
			'nightcore',
			'rap',
			'lo-fi',
			'inattendu'
		]);

		for (const artist in musics) {
			for (music of musics[artist]) for (tag of music.tags) tags.add(tag);
		}
		// tags = tags.concat(musics[artist].reduce((acc, cur) => acc.concat(cur.tags), []));

		res.json([...tags]);
	});

	router.put('/tag', (req, res) => {
		for (music in musics[req.body.artist]) {
			if (musics[req.body.artist][music].src === req.body.src) {
				musics[req.body.artist][music].tags.push(req.body.tag);
			}
		}

		res.sendStatus(200);
	});

	router.delete('/tag', (req, res) => {
		for (music in musics[req.body.artist]) {
			if (musics[req.body.artist][music].src === req.body.src) {
				musics[req.body.artist][music].tags.splice(
					musics[req.body.artist][music].tags.indexOf(req.body.tag, 1)
				);
			}
		}
		res.sendStatus(200);
	});

	return router;
};
