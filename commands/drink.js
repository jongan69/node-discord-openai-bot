const { SlashCommandBuilder } = require('discord.js');

async function makeDrink(Ingredients) {
  let drinks = await fetch("https://ai-bartender.vercel.app/api/returnDrinks", {
    method: "POST",
    body: JSON.stringify(Ingredients)
  })
    .then(async (data) => data.json())
  return drinks
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drink')
		.setDescription('Makes drink with AI'),
	async execute(interaction) {
		return interaction.reply(await makeDrink(Ingredients));
	},
};