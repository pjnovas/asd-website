
module.exports = function(){

  window.asd = window.asd || {};

  // Init Helpers
  window.asd.settings = require('./settings');

  smoothScroll.init({
    speed: 1000,
    easing: 'easeInOut'
  });
  
};
