const chalk = require("chalk");

class HelpGroup {

	b() {
		const b = chalk.blue;
	}

	l() {
		const c = chalk.cyan;
	}
	run() {
		const b = (s) => chalk.blue(s);
		const l = (s) => chalk.white(s);
		const o = (s) => chalk.keyword('orange')(s);

		const commandLineUsage = require('command-line-usage')
		const options = require('../utils/cli-flags');
		const title = chalk.bold.underline("webpack-CLI");
		const desc = "The build tool for webpack projects";
		const usage = "Usage: " + "`" + o('webpack [...options] | <command>') + "`";
		const examples = "Example: " + "`" + o('webpack help --flag | <command>') + "`";

const hh =`                                                                 
                ${l('----  ----')}                   
             ${l('-------  -------')}                 
         ${l('-----------  -----------')}             
      ${l('--------------  --------------')}          
   ${l('---------------')}${b('.:++:.')}${l('---------------')}       
 ${l('--------------')}${b('-+syyyyyys/-´´.')}${l('-----------')}     ${title}
 ${l('----------')}${b('./oyyyyyyyyyyyyyso/.')}${l('----------')}            
 ${l('---------')}${b(':+syyyyyyyyyyyyyys+:')}${l('    -------')}     ${desc}     
 ${l('------- ')}${b(':s+-´-/syyyyyyyys/-´-+s:')}${l(' -------')}     
 ${l('------- ')}${b(':yyyyo:..:+ss+:../oyyyy:')}${l(' -------')}     ${usage}
 ${l('------- ')}${b(':yyyyyyys/-´´-+syyyyyyy:')}${l(' -------')}     
 ${l('------- ')}${b('-oyyyyyyyyy..yyyyyyyyyo-')}${l(' -------')}     ${examples}
 ${l('---------')}${b('´´:+syyyyy..yyyyys+-´´.´')}${l('-------')}     
 ${l('-------------')}${b('´.:osy..yso:.´')}${l('------------')}     
   ${l('--------------')}${b('´´-´´-´´.')}${l('-------------')}       
      ${l('--------------  --------------')}          
         ${l('-----------  -----------')}             
             ${l('-------  -------')}                 
                ${l('----  ----')}              
`
		const sections = commandLineUsage([
			{
				content: hh,
				raw: true,
			  },
	 		{
				header: 'Available Commands',
				content: options.commands.map(e => {return {name: e.name, summary: e.description}})
			},
			{
				header: 'Options',
				optionList: options.core,
			  }
		  ]);
		return { outputOptions: {
			help: sections
		}};
	}
}

module.exports = HelpGroup;
