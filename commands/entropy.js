const { SlashCommandBuilder } = require('discord.js');

async function getEntropy() {
  let entropy = await fetch("https://next-link-adapter.vercel.app/api/entropyAdapterComplete", {
    method: "GET"
  })
    .then(async (data) => data.json())
  return entropy
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('entropy')
    .setDescription('replies with entropy'),
  async execute(interaction) {
    let entropy = await getEntropy()
    return interaction.reply(entropy);
  },
};