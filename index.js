const { Client } = require("discord.js")
const db = require("croxydb")
const fs = require("fs")
const cf = require("./config/config.js")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

client.login(cf.token)

client.on("ready", async () => {
    client.user.setPresence({ status: cf.bot_status, activities: cf.bot_status.activities })
    console.log("-------------------------------------")
    console.log("-------------Bot Aktif---------------")
    console.log(`-------------${client.user.username}---------------`)
    console.log(`-------------${cf.prefix}---------------`)
    console.log("-------------------------------------")
})

client.commands = new Collection();
client.aliases = new Collection();
module.exports = client;

fs.readdir("./commands", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./commands/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
})

client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(cf.prefix)) return;
    let command = message.content.toLocaleLowerCase().split(" ")[0].slice(cf.prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        cmd.run(client, message, params)
    }
});