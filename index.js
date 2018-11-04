const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require("fs");

client.on("ready", () => {
  console.log("BOT Attivo");
  client.user.setActivity('Use $help');
});

client.on("message", msg => {

	const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;
	
	if (command === "w") {
		
		let sec_cmd = args[0];
		let id = msg.member.user.id;
		let url = `https://api.wasdit.games/playerapi/getplayer?playerid=${id}`;
		let author_un = msg.author.username;
		let author = msg.author;
		
		const waslogo = new Discord.Attachment('/img/LogoWasdit.png', "LogoWasdit.png");
		
		console.log(id)
		
		var options = {
			method: 'POST',
			uri: url,
			json: true // Automatically stringifies the body to JSON
		};
		 
		rp(options)
			.then(function (parsedBody) {
				//console.log(parsedBody);
				fs.writeFile('./punti.json', JSON.stringify(parsedBody), (err) => {  
					if (err) throw err;
					console.log('Data written to file');
				});
				
				let msg_punti = `${parsedBody.WasditPoint}`;
				let socialp = `${parsedBody.SocialProfile}`;
				let mex = "Ehi "+ author + " hai accumulato " + msg_punti + " Wasdit Points!"
				console.log( author_un + " " + msg_punti);
				console.log( socialp )
				
				/*const objEmbed = {
					color: 0xFFFF00,
					author: {
						name: 'WASDIT Info',
						icon_url: client.user.avatarURL,
					},
					thumbnail: {
						url: `${parsedBody.Image}`,
					},
					fields: [
						{
							name: "Punti accumulati",
							value: (mex),
						},
						
						{
							name: '\u200B',
							value: '\u200B',
						},
						
						{
							name: "Profilo di "+ author_un,
							value: "[Vai al profilo...](https://alpha.wasdit.games/#/Player/"+`${id}`+")",
						},
						
						{
							name: "Wasdit Home",
							value: "[Vai alla home...](https://alpha.wasdit.games/#/Home)",
						},
						
						{
							name: "Wasdit Shop",
							value: "[Vai allo shop...](https://alpha.wasdit.games/#/Shop)",
						},
					],
					timestamp: new Date(),
					footer: {
						text: "",
						icon_url: '',
					},
				};
				msg.channel.send('', {embed: objEmbed})*/
				
				const msgEmbed = new Discord.RichEmbed()
					.attachFile(waslogo)
					.setColor('0x00FF00')
					.setAuthor('WASDIT Info','attachment://LogoWasdit.png')
					.setDescription('Informazioni riguardo a Wasdit')
					.setThumbnail(`${parsedBody.Image}`)
					.addBlankField()
					.addField("Punti accumulati" , (mex))
					.addBlankField()
					.addField("Profilo di " + author_un , "[Vai al profilo...](https://alpha.wasdit.games/#/Player/"+`${id}`+")", true)
					//.addBlankField()
					//.addField("Social di " + author_un , "[Vai al link...]("+socialp+")")
					.addField("Wasdit Home" , "[Vai alla Home...](https://alpha.wasdit.games/#/Shop)", true)
					//.addBlankField()
					.addField("Wasdit Shop" , "[Vai allo Shop...](https://alpha.wasdit.games/#/Shop)", true)
					//.addBlankField()
					.setFooter('\u200B','attachment://LogoWasdit.png')
					.setTimestamp();
		
				try {
					msg.channel.send(msgEmbed);
				}
				catch (e) {
					console.log(e.message);
				}
				
			})
			.catch(function (err) {
				console.log(err)
			});
		
		
		/*msg.delete(1000)
		  .then(msg => console.log(`Messaggio eliminato a ${msg.author.username}`))
		  .catch(console.error);*/
		
		
	}
	
	
	
	// comando help: visualizza i comandi via messaggio privato
	else if (command === "help") {
		
		let mex= "\tComandi per il bot Bongo Il Mercante"
		let mex1= "Con '$w' posterà il messaggio di Info base di Wasdit, con i punti accumulati i vari Link";
		let mex2= "Con ";
		//let mex_globale = "```"+ mex1 + "\n\n" + mex2 + "```";
		
		const msgEmbed = new Discord.RichEmbed()
			.setColor('#00FF00')
			.setTitle('WASDIT-Info')
			.setDescription('Comandi Wasdit Info Bot')
			.addField("1)", (mex1))
			//.addField("2)", (mex2))
			.addBlankField()
			.setTimestamp();
		
		try {
			msg.author.send(msgEmbed);
		}
		catch (e) {
			console.log(e.message);
		}
		msg.delete(1000)
			  .then(msg => console.log(`(help)Messaggio eliminato da ${msg.author.username}`))
			  .catch(console.error);
	}
	
});

client.login(config.token);
