const bot = require('./bot.js');

const start = {
  start: async(name, pass, lang, xp) => {
    try{
      await bot.initialize();

      await bot.login(name, pass);

      await bot.addxp(lang, xp);

      await bot.close();
    }catch(e){
      await bot.close();
    }
  }
}

module.exports = start;
