const keep_alive = require('./keep_alive.js');
const { Client, Intents } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");

// Open AI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Discord Client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// command prefixes
const aitextprefix = "?";
const aitextopenprefix = "!";
const artaiprefix = ":";
const comboaiprefix = "-";
const tweetaiprefix = ":tweet";
const imageaiprefix = ":image";

client.once('ready', () => {
  console.log('Ready!');
});

// Welcome Message
client.on('messageCreate', msg => {
  let welcomeChannel = msg.channel.toString() == '<#736380654396244058>';
  let isNotNew = msg.member.roles.cache.some(r => ["Developer", "Admin", "Member"].includes(r.name));
  let isNotBot = msg.author.id != client.user.id;

  if (isNotBot && welcomeChannel && !isNotNew) {
    console.log(`A message was sent in Welcome: ${msg.channel}`)
    msg.channel.send(`Hey @${msg.author.username}, Welcome to the Server! My name is ${client.user}. To use Open AI in here, start your message with "!" Followed by your prompt. For Example:`);
    msg.channel.send(`! write a poem for @${msg.author.username}`);
  }
});

// Howcool
client.on('messageCreate', msg => {
  let mention = msg.mentions.users.first();
  let args = msg.content.includes("howcool");
  if (args && mention) {
    msg.channel.send(`${mention} is ${Math.floor(Math.random() * 100) + 1}% cool!`)
  } else if (args) {
    msg.channel.send(`You are ${Math.floor(Math.random() * 100) + 1}% cool!`)
  }
});

// Basic Slash Functions
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

// AI Image Variation
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(imageaiprefix)) return;
  const commandBody = msg.content.slice(imageaiprefix.length);
  const args = commandBody.split(' ');
  let recievedImages = msg.attachments
  let attachment = recievedImages.first();

  if (attachment.length > 0) {
    try {
      const response = await openai.createImageVariation({
        image: attachment,
        n: 1,
        size: '512x512',
        response_format: 'url'
      })

      let answers = response?.data
      if (answers) {
        answers?.forEach((item) => {
          msg.channel.send(`${item.url}`)
        })
      }
    } catch (err) {
      msg.channel.send(`Something Happened!: ${err}`)
    }
  } else {
    msg.channel.send('Waiting for Image Upload');
  }

});

// AI Text
client.on('messageCreate', async msg => {
  if (!msg.content.startsWith(aitextprefix)) return;
  const commandBody = msg.content.slice(aitextprefix.length);
  const args = commandBody.split(' ');
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Answer this question completely: ${args}`,
      max_tokens: 2048,
      temperature: 0.8,
    })

    let answers = response.data.choices
    if (answers) {
      answers.forEach((item) => {
        msg.channel.send(`${item.text}`)
      })
    } else {
      console.warn(response)
    }
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// AI Text Open
client.on('messageCreate', async msg => {
  if (!msg.content.startsWith(aitextopenprefix)) return;
  const commandBody = msg.content.slice(aitextopenprefix.length);
  const args = commandBody.split(' ');
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${args}`,
      max_tokens: 2048,
      temperature: 0.8,
    })

    let answers = response.data.choices
    if (answers) {
      answers.forEach((item) => {
        msg.channel.send(`${item.text}`)
      })
    } else {
      console.warn(response)
    }
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// AI Image
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(artaiprefix)) return;
  const commandBody = msg.content.slice(artaiprefix.length);
  const args = commandBody.split(' ');

  try {

    const response = await openai.createImage({
      prompt: `${args}`,
      n: 1,
      size: "512x512",
      user: msg.author.username
    })

    let answers = response.data
    if (answers && answers.data[0].url) {
      msg.channel.send(`${answers.data[0].url}`)
    } else {
      msg.channel.send(`${JSON.stringify(response.data)}`)
    }

  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// AI Blog Posts
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(comboaiprefix)) return;
  const commandBody = msg.content.slice(comboaiprefix.length);
  const args = commandBody.split(' ');

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a blog about using cited facts: ${args}.`,
      max_tokens: 2048,
      temperature: 0.8,
    })

    let blogpost = response.data.choices[0].text
    console.log('blogpost', blogpost)
    let sentences = blogpost.split('.')

    if (sentences) {
      sentences.forEach(async (sentence, index) => {
        console.log('image prompts', sentence)

        if (sentence.length > 0) {
          const response = await openai.createImage({
            prompt: `Generate an Image that embodies ${sentence}`,
            n: 1,
            size: "512x512",
            user: msg.author.username
          })
          let image = response.data

          if (image && image.data[0].url) {
            msg.channel.send(`${image.data[0].url}`)
            msg.channel.send(`${sentence}`)
          } else {
            msg.channel.send(`${JSON.stringify(response.data)}`)
          }
        }
      })

    } else {
      console.warn(response)
    }
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// AI Image Tweet
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(tweetaiprefix)) return;
  const commandBody = msg.content.slice(tweetaiprefix.length);
  const args = commandBody.split(' ');
  try {

    const response1 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a tweet about ${args}.`,
      max_tokens: 2048,
      temperature: 0.8,
    })
    let tweet = response1.data.choices[0].text

    const response2 = await openai.createImage({
      prompt: `Generate an image about ${tweet}`,
      n: 1,
      size: "512x512",
      user: msg.author.username
    })
    let image = response2.data

    if (image && tweet) {
      msg.channel.send(`${image.data[0].url}`)
      msg.channel.send(`${tweet}`)
    } else {
      msg.channel.send(`${JSON.stringify(response1.data)}`)
    }
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

// Test Command
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith("Test")) return;
  try {
    msg.channel.send(`The bot is active!`)
  } catch (err) {
    msg.channel.send(`${err}`)
  }
});

client.login(process.env.DISCORD_BOT_SECRET);