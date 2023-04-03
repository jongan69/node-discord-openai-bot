const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('entropy')
    .setDescription('replies with entropy'),
  async execute(interaction) {
    let entropy = await fetch("https://next-link-adapter.vercel.app/api/entropyAdapterComplete", {
    method: "GET"
  })
    .then((data) => data.json())
    return interaction.reply(`Entropy Response: ${entropy}`);
  },
};