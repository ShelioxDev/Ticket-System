//Made by Sheliox#9116
module.exports.config = {
  name: "ticket",
  description: "Permet de créer un panel.",
  aliases: [],
};

module.exports.run = async (client, message, args) => {
  const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
  message.delete();

  if (message.author.bot) return;
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.reply(
      "Vous n'avez pas la permission d'utiliser cette commande."
    );
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("ticketanonymbot")
      .setLabel("🎫 Créer un ticket")
      .setStyle("SECONDARY")
  );

  const embed = new MessageEmbed()
    .setColor("GREY")
    .setTitle("Ouvrir un Ticket")
    .setDescription(`${message.guild}`)
    .addField(
      "Merci de presser le bouton ci-dessous pour ouvrire votre ticket",
      "Vous serez mentionné dans le ticket créé"
    )
    .setThumbnail(message.guild.iconURL())
    .setFooter(
      "Bot créé par AnonymDev",
      "https://avatars.githubusercontent.com/u/85024000?s=400&u=ee0c10d24d317944b654f351b65078e6a68c6729&v=4"
    )
    .setTimestamp(Date.now());

  message.channel.send({ embeds: [embed], components: [row] });
}
