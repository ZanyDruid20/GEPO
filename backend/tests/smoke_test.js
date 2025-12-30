require('dotenv').config();
const languageService = require('../services/language_service');

(async () => {
  try {
    const username = 'ZanyDruid20';
    const result = await languageService.getLanguageBreakDown(username);
    
    console.log(`User: ${result.username}`);
    console.log(`Total Repos: ${result.totalRepos}`);
    //console.log(`Total Bytes: ${result.totalBytes.toLocaleString()}`);
    console.log('\nLanguage Breakdown:');
    console.log('─'.repeat(60));
    
    result.languages.forEach((lang, index) => {
      console.log(`${index + 1}. ${lang.language.padEnd(20)} ${lang.percentage}% (${lang.bytes.toLocaleString()} bytes)`);
    });
  } catch (err) {
    console.error('Test failed:', err.message);
    console.error(err.stack);
  }
})();