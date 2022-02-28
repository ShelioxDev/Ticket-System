module.exports = async (Client, data) => {
  const figlet = require("figlet");
  let statut = [
    "+help | Serveurs : " + Client.guilds.cache.size,
    "+help | Utilisateurs : " +
      Client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
  ];
  setInterval(() => {
    Client.user.setActivity(statut[Math.floor(Math.random() * statut.length)]);
  }, 12000);
  console.log(
    figlet.textSync("AnonymBot opérationnel", {
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
};
