const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', msg => {
  if (msg.author.id != client.user.id && msg.channel.toString() == '<#736380654396244058>') {
    console.log(`A message was sent in Welcome: ${msg.channel}`)
    msg.channel.send(`Hey @${msg.author.username}, Welcome to the Server! My name is ${client.user}`);
  }
});

client.on('messageCreate', msg => {
  if (msg.author.bot) return;
  let mention = msg.mentions.users.first()
  if (msg.content === "howcool" && mention) {
    msg.channel.send(`${mention} is ${Math.floor(Math.random() * 100) + 1}% cool!`)
  } else if (msg.content === "howcool") {
    msg.channel.send(`You are ${Math.floor(Math.random() * 100) + 1}% cool!`)
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'server') {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  } else if (commandName === 'user') {
    await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
  }
});

client.login(token);