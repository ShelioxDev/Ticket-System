const fs = require('fs');

function loadCommands(client) {
	fs.readdir('./src/commands/', (err, cmdfolders) => {

		if (err) console.log(err);

		if(!cmdfolders[0]) return console.log('Client ne trouve aucune commande dans le dossier commandes !');
		cmdfolders.forEach((cmdfolder) => {
			fs.readdir(`./src/commands/${cmdfolder}`, (err, cmds) => {
				if (!cmds) return console.error(`Client ne trouve aucune commande dans le dossier ${cmdfolder} !`);
				cmds = cmds.filter(z => z.split('.')[1] === 'js');
				cmds.forEach((cmd) => {
					const pull = require(`../commands/${cmdfolder}/${cmd}`);
					client.commands.set(pull.config.name, pull);
					pull.config.aliases.forEach((alias) => {
						client.aliases.set(alias, pull.config.name);
					});
				});
			});
		});
	});
};

module.exports = loadCommands;