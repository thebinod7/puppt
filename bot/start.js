const bot = require('./bot.js');

const start = {
  start: (name, pass, lang, xp) => {
    try{
      bot.initialize();

      bot.login(name, pass);

      bot.addxp(lang, xp);

      bot.close();
    }catch(e){
      bot.close();
    }
  }
}

module.exports = start;
