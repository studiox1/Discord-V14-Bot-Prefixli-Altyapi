const { EmbedBuilder } = require("discord.js");
const cf = require("../config/config.js");

exports.run = async (client, message, args) => {
    const Komutlar = client.commands.filter(cmd => cmd.help.kategori === "a");

    let komutlarListesi = Komutlar.size > 0
        ? Komutlar.map(cmd => `${cf.prefix}**${cmd.help.name}** **→** ${cmd.help.description}`).join("\n")
        : "Bu kategoriye ait komut bulunamadı.";

    const embed = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: `https://discord.gg/3jM3vZWARx` })
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(cf.color)
    .setDescription(komutlarListesi)
    .setFooter({ text: `Kullanan: ${message.author.globalName}`, iconURL: message.author.displayAvatarURL() })
    .setTimestamp();

    await message.reply({ embeds: [embed] })
}

exports.conf = {
    aliases: ["cmd", "h", "y", "help"]
};

exports.help = {
    name: 'yardım',
    description: 'Bu Komut Botun Yardım Menüsünü Gösterir!',
    kategori: "a"
};