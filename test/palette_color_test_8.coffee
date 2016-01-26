'use strict'
vows = require  'vows'
assert = require  'assert'
_package = require '../package.json'
trucolor = require '..'
namedVows = vows.describe "#{_package.name} 8 bit Simple/Chalk-ish Palette Test"
namedVows.addBatch
	"Simple Palette":
		topic: ->
			trucolor.simplePalette({force: 'hundreds'})
		"is white?"             : (topic) ->
			assert.equal "#{topic.white}", '\u001b[38;5;249m'
			assert.equal topic.white.out, '\u001b[39m'
		"is black?"             : (topic) ->
			assert.equal "#{topic.black}", '\u001b[38;5;233m'
			assert.equal topic.black.out, '\u001b[39m'
		"is red?"               : (topic) ->
			assert.equal "#{topic.red}", '\u001b[38;5;160m'
			assert.equal topic.red.out, '\u001b[39m'
		"is green?"             : (topic) ->
			assert.equal "#{topic.green}", '\u001b[38;5;40m'
			assert.equal topic.green.out, '\u001b[39m'
		"is blue?"              : (topic) ->
			assert.equal "#{topic.blue}", '\u001b[38;5;62m'
			assert.equal topic.blue.out, '\u001b[39m'
		"is cyan?"              : (topic) ->
			assert.equal "#{topic.cyan}", '\u001b[38;5;44m'
			assert.equal topic.cyan.out, '\u001b[39m'
		"is yellow?"            : (topic) ->
			assert.equal "#{topic.yellow}", '\u001b[38;5;184m'
			assert.equal topic.yellow.out, '\u001b[39m'
		"is magenta?"           : (topic) ->
			assert.equal "#{topic.magenta}", '\u001b[38;5;164m'
			assert.equal topic.magenta.out, '\u001b[39m'
		"is bright white?"      : (topic) ->
			assert.equal "#{topic.brightWhite}", '\u001b[38;5;231m'
			assert.equal topic.brightWhite.out, '\u001b[39m'
		"is bright red?"        : (topic) ->
			assert.equal "#{topic.brightRed}", '\u001b[38;5;203m'
			assert.equal topic.brightRed.out, '\u001b[39m'
		"is bright green?"      : (topic) ->
			assert.equal "#{topic.brightGreen}", '\u001b[38;5;83m'
			assert.equal topic.brightGreen.out, '\u001b[39m'
		"is bright blue?"       : (topic) ->
			assert.equal "#{topic.brightBlue}", '\u001b[38;5;63m'
			assert.equal topic.brightBlue.out, '\u001b[39m'
		"is bright cyan?"       : (topic) ->
			assert.equal "#{topic.brightCyan}", '\u001b[38;5;87m'
			assert.equal topic.brightCyan.out, '\u001b[39m'
		"is bright yellow?"     : (topic) ->
			assert.equal "#{topic.brightYellow}", '\u001b[38;5;227m'
			assert.equal topic.brightYellow.out, '\u001b[39m'
		"is bright magenta?"    : (topic) ->
			assert.equal "#{topic.brightMagenta}", '\u001b[38;5;207m'
			assert.equal topic.brightMagenta.out, '\u001b[39m'
		"is example (#B262FF)?" : (topic) ->
			assert.equal "#{topic.example}", '\u001b[38;5;141m'
			assert.equal topic.example.out, '\u001b[39m'
		"is command (#1579CF)?" : (topic) ->
			assert.equal "#{topic.command}", '\u001b[38;5;32m'
			assert.equal topic.command.out, '\u001b[39m'
		"is argument (#4CB0DF)?": (topic) ->
			assert.equal "#{topic.argument}", '\u001b[38;5;74m'
			assert.equal topic.argument.out, '\u001b[39m'
		"is option (#C1BA89)?"  : (topic) ->
			assert.equal "#{topic.option}", '\u001b[38;5;187m'
			assert.equal topic.option.out, '\u001b[39m'
		"is operator (#FFFFFF)?": (topic) ->
			assert.equal "#{topic.operator}", '\u001b[38;5;231m'
			assert.equal topic.operator.out, '\u001b[39m'
		"is dim?"               : (topic) ->
			assert.equal "#{topic.dim}", '\u001b[2m'
			assert.equal topic.dim.out, '\u001b[22m'
		"is bold?"              : (topic) ->
			assert.equal "#{topic.bold}", '\u001b[1m'
			assert.equal topic.bold.out, '\u001b[22m'
		"is italic?"            : (topic) ->
			assert.equal "#{topic.italic}", '\u001b[3m'
			assert.equal topic.italic.out, '\u001b[23m'
		"is invert?"            : (topic) ->
			assert.equal "#{topic.invert}", '\u001b[7m'
			assert.equal topic.invert.out, '\u001b[27m'
		"is reset?"             : (topic) ->
			assert.equal "#{topic.reset}", '\u001b[0m'
			assert.equal topic.reset.out, '\u001b[m'
		"normal as normal?"     : (topic) ->
			assert.equal "#{topic.reset}", '\u001b[0m'
			assert.equal topic.reset.out, '\u001b[m'
		"reset as normal?"      : (topic) ->
			assert.equal "#{topic.reset}", '\u001b[0m'
			assert.equal topic.reset.out, '\u001b[m'

	"Chalk-ish Palette":
		topic: ->
			trucolor.chalkishPalette({force: 'hundreds'})
		"is white?"             : (topic) ->
			assert.equal topic.white('white'), '\u001b[38;5;249mwhite\u001b[39m'
		"is black?"             : (topic) ->
			assert.equal topic.black('black'), '\u001b[38;5;233mblack\u001b[39m'
		"is red?"               : (topic) ->
			assert.equal topic.red('red'), '\u001b[38;5;160mred\u001b[39m'
		"is green?"             : (topic) ->
			assert.equal topic.green('green'), '\u001b[38;5;40mgreen\u001b[39m'
		"is blue?"              : (topic) ->
			assert.equal topic.blue('blue'), '\u001b[38;5;62mblue\u001b[39m'
		"is cyan?"              : (topic) ->
			assert.equal topic.cyan('cyan'), '\u001b[38;5;44mcyan\u001b[39m'
		"is yellow?"            : (topic) ->
			assert.equal topic.yellow('yellow'), '\u001b[38;5;184myellow\u001b[39m'
		"is magenta?"           : (topic) ->
			assert.equal topic.magenta('magenta'), '\u001b[38;5;164mmagenta\u001b[39m'
		"is bright white?"      : (topic) ->
			assert.equal topic.brightWhite('bright white'), '\u001b[38;5;231mbright white\u001b[39m'
		"is bright red?"        : (topic) ->
			assert.equal topic.brightRed('bright red'), '\u001b[38;5;203mbright red\u001b[39m'
		"is bright green?"      : (topic) ->
			assert.equal topic.brightGreen('bright green'), '\u001b[38;5;83mbright green\u001b[39m'
		"is bright blue?"       : (topic) ->
			assert.equal topic.brightBlue('bright blue'), '\u001b[38;5;63mbright blue\u001b[39m'
		"is bright cyan?"       : (topic) ->
			assert.equal topic.brightCyan('bright cyan'), '\u001b[38;5;87mbright cyan\u001b[39m'
		"is bright yellow?"     : (topic) ->
			assert.equal topic.brightYellow('bright yellow'), '\u001b[38;5;227mbright yellow\u001b[39m'
		"is bright magenta?"    : (topic) ->
			assert.equal topic.brightMagenta('bright magenta'), '\u001b[38;5;207mbright magenta\u001b[39m'
		"is example (#B262FF)?" : (topic) ->
			assert.equal topic.example('example'), '\u001b[38;5;141mexample\u001b[39m'
		"is command (#1579CF)?" : (topic) ->
			assert.equal topic.command('command'), '\u001b[38;5;32mcommand\u001b[39m'
		"is argument (#4CB0DF)?": (topic) ->
			assert.equal topic.argument('argument'), '\u001b[38;5;74margument\u001b[39m'
		"is option (#C1BA89)?"  : (topic) ->
			assert.equal topic.option('option'), '\u001b[38;5;187moption\u001b[39m'
		"is operator (#FFFFFF)?": (topic) ->
			assert.equal topic.operator('operator'), '\u001b[38;5;231moperator\u001b[39m'
		"is dim?"               : (topic) ->
			assert.equal topic.dim('dim'), '\u001b[2mdim\u001b[22m'
		"is bold?"              : (topic) ->
			assert.equal topic.bold('bold'), '\u001b[1mbold\u001b[22m'
		"is italic?"            : (topic) ->
			assert.equal topic.italic('italic'), '\u001b[3mitalic\u001b[23m'
		"is invert?"            : (topic) ->
			assert.equal topic.invert('invert'), '\u001b[7minvert\u001b[27m'
		"is reset?"             : (topic) ->
			assert.equal topic.reset('reset'), '\u001b[0mreset\u001b[m'
		"normal as normal?"     : (topic) ->
			assert.equal topic.reset('reset'), '\u001b[0mreset\u001b[m'
		"reset as normal?"      : (topic) ->
			assert.equal topic.reset('reset'), '\u001b[0mreset\u001b[m'

	"Chalk-ish Palette - nested colours":
		topic: ->
			trucolor.chalkishPalette({force: 'hundreds'})
		"is white red white?"   : (topic) ->
			assert.equal topic.white('white ' + topic.red('red') + ' white'),
				'\u001b[38;5;249mwhite \u001b[38;5;160mred\u001b[38;5;249m white\u001b[39m'
		"is blue italic blue?"   : (topic) ->
			assert.equal topic.blue('blue ' + topic.italic('italic') + ' blue'),
				'\u001b[38;5;62mblue \u001b[3mitalic\u001b[23m blue\u001b[39m'

.export(module)