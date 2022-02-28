//Made by Sheliox#9116
module.exports = async (client, interaction, msglimit) => {
  try {
    if (interaction.user.bot) return;

    const fs = require("fs");
    const ticket = JSON.parse(fs.readFileSync("./ticket.json"));
    const setup = JSON.parse(fs.readFileSync("./setup.json"));
    const guild = interaction.guild;
    const rolesAcces = {
      modo: guild.roles.cache.get(setup[guild]["modo"]),
      everyone: guild.roles.cache.get(guild.id),
    };
    const {
      MessageActionRow,
      MessageButton,
      MessageEmbed,
    } = require("discord.js");
    if (interaction.isButton()) {
      if (interaction.customId === "ticketanonymbot") {
        var gadjo = interaction.user.username;
        guild.channels
          .create(`support 🔴 ${interaction.user.username}`, { type: "text" })
          .then(async (channel) => {
            channel.setParent(
              guild.channels.cache.get(
                setup[guild]["ticket"],
                (c) => c.type === "category"
              )
            );

            ticket[guild] = {
              id: guild.id,
              ticketu: interaction.user.id,
              ticketc: channel.id,
            };
            fs.writeFileSync("./ticket.json", JSON.stringify(ticket));

            channel.permissionOverwrites.edit(rolesAcces.everyone, {
              SEND_MESSAGES: false,
              VIEW_CHANNEL: false,
            });
            channel.permissionOverwrites.create(ticket[guild]["ticketu"], {
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true,
            });
            channel.permissionOverwrites.create(rolesAcces.modo, {
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true,
            });
            await channel.send(`${interaction.user}`);
            interaction.reply({
              content: `Ticket crée avec succès ${channel}`,
              ephemeral: true,
            });

            const row2 = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("closeticket")
                .setLabel("🚪 Fermer le ticket")
                .setStyle("SECONDARY")
            );

            const m = new MessageEmbed()
              .setColor("GREY")
              .setTitle("Fermer le Ticket")
              .setDescription(`${interaction.guild}`)
              .addField(
                `Voici votre ticket ${interaction.user.username}. Pour fermer le ticket, veuillez cliquer sur 🚪`,
                "Si vous rencontrez d'autres problèmes n'hésitez pas à en recréer un."
              )
              .setThumbnail(interaction.guild.iconURL())
              .setTimestamp(Date.now())
              .setFooter(
                `Ticket créé par ${interaction.user.username}`,
                interaction.user.displayAvatarURL()
              );
            await channel.send({ embeds: [m], components: [row2] });
          });
      }
      /*const fetched = await client.channels.cache.get(interaction.channel.id)
.fetchMessages()
.then(messages => console.log(`[${messages.first().author.name}]${messages.first().content}`));*/
    }
    if (interaction.customId === "closeticket") {
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("noclose")
          .setLabel("Annuler")
          .setEmoji("934825186761539605")
          .setStyle("DANGER")
      );

      const row2 = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("confirmclose")
          .setLabel("Confirmer")
          .setEmoji("935282260410761216")
          .setStyle("SUCCESS")
      );
      await interaction.reply({
        content: "Êtes vous sûr de vouloir fermer ce ticket ?",
        components: [row, row2],
      });
    }
    if (interaction.customId === "noclose") {
      interaction.message.delete();
    }
    if (interaction.customId === "confirmclose") {
      let tchannel = ticket[guild]["ticketc"];
      let channel = guild.channels.cache.get(tchannel);
      channel.permissionOverwrites.edit(rolesAcces.everyone, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
      });
      channel.permissionOverwrites.create(ticket[guild]["ticketu"], {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
      });
      channel.permissionOverwrites.create(rolesAcces.modo, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
      });
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("transcript")
          .setLabel("Transcription")
          .setEmoji("📝")
          .setStyle("SECONDARY")
      );

      const row2 = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("reopen")
          .setLabel("Ouvrir")
          .setEmoji("🔓")
          .setStyle("SUCCESS")
      );

      const row3 = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("confirmconfirmed")
          .setLabel("Confirmer")
          .setEmoji("📛")
          .setStyle("DANGER")
      );
      await interaction.reply({
        content: "`Que voulez vous faire ?`",
        components: [row, row2, row3],
      });
    }
    if (interaction.customId === "confirmconfirmed") {
      let tchannel = ticket[guild]["ticketc"];
      let channel = guild.channels.cache.get(tchannel);
      channel.delete();
    } else if (interaction.customId === "reopen") {
      let tchannel = ticket[guild]["ticketc"];
      let channel = guild.channels.cache.get(tchannel);
      channel.permissionOverwrites.edit(rolesAcces.everyone, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
      });
      channel.permissionOverwrites.create(ticket[guild]["ticketu"], {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
      });
      channel.permissionOverwrites.create(rolesAcces.modo, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
      });
      interaction.reply({
        content: `Ticket réouvert avec succès !`,
        ephemeral: true,
      });
    } else if (interaction.customId === "transcript") {
      const sourcebin = require("sourcebin_js");
      const embed = new MessageEmbed()
        .setColor("GREY")
        .setTitle("En cours...")
        .setDescription("Veuillez patienter.")
        .addField(`Transcription...`, "<a:loading:937026352106852372>")
        .setThumbnail(interaction.guild.iconURL())
        .setTimestamp(Date.now());
      let temporaryembed = await interaction.channel.send({ embeds: [embed] });
      const channel = interaction.channel;
      if (channel.name.includes("support-")) {
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
          channel.messages.fetch().then(async (messages) => {
            const output = messages
              .map(
                (m) =>
                  `${new Date(m.createdAt).toLocaleString("fr-FR")} - ${
                    m.author.tag
                  }: ${
                    m.attachments.size > 0
                      ? m.attachments.first().proxyURL
                      : m.content
                  }`
              )
              .join("\n");

            let response;
            try {
              response = await sourcebin.create(
                [
                  {
                    name: "Ticket",
                    content: output,
                    languageId: "text",
                  },
                ],
                {
                  title: `Transcription du chat pour ${channel.name}`,
                  description: `Le ticket de ${ticket[guild]["ticketu"]}`,
                }
              );
            } catch (e) {
              console.log(e);
              return interaction.reply(
                "<a:uncheck:934825186761539605> **Une erreur s'est produite, veuillez réessayer**"
              );
            }

            const embed2 = new MessageEmbed()
              .setTitle(`Transcription du ticket`)
              .setDescription(
                `Merci d'avoir patienté, ticket de <@${ticket[guild]["ticketu"]}>`
              )
              .addField(
                `**Voici une transcription du ticket, veuillez cliquer sur le lien ci-dessous.**`,
                `**[Transcription](${response.url})**`
              )
              .setFooter(
                "Bot créé par AnonymDev",
                "https://avatars.githubusercontent.com/u/85024000?s=400&u=ee0c10d24d317944b654f351b65078e6a68c6729&v=4"
              )
              .setColor("GREY");
            await temporaryembed.edit({ embeds: [embed2] });
          });
        }
      } else {
        return interaction.reply(
          "<a:uncheck:934825186761539605> **Vous ne pouvez pas utiliser cette commande ici. Veuillez utiliser cette commande dans un ticket ouvert.**"
        );
      }
      /*fs.writeFileSync(`${interaction.channel.name}.txt`, content.join('\n'), err => { if (err) throw err });

  doneEmbed(message, lang.ticket.transcript.replace('{name}', `${interaction.channel.name}.txt`));
  return interaction.channel.send(new MessageAttachment(`${interaction.channel.name}.txt`, `${interaction.channel.name}.txt`));*/
    }
  } catch (error) {
    console.error(error);
  }
};
