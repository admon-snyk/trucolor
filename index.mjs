import _mapValues from 'lodash/mapValues';
import { createConsole } from 'verbosity';
import meta from '@thebespokepixel/meta';
import _reduce from 'lodash/reduce';
import { tinycolor, TinyColor, names } from '@thebespokepixel/es-tinycolor';
import converter from 'color-convert';
import _map from 'lodash/map';
import _remove from 'lodash/remove';
import SGRcomposer from 'sgr-composer';
import terminal from 'term-ng';
import escStringRE from 'escape-string-regexp';

class Processor {
  constructor(colorname) {
    this.baseName = colorname;
    this.lockedName = false;
    this.attributes = {
      background: false,
      bold: false,
      dim: false,
      italic: false,
      invert: false,
      underline: false,
      blink: false
    };
    this.haveAttrs = false;
    this.haveSource = false;
    this.queue = [];
    this.haveQueue = false;
    this.namePrefix = '';
    this.nameSuffix = '';
    console.debug(`New Process: ${this.baseName}`);
  }

  render() {
    return this.haveSource ? _reduce(this.queue, (color, step) => step(color), tinycolor(this.rgb)) : 'none';
  }

  get source() {
    return this.interpreter;
  }

  set source(interpreter) {
    this.interpreter = interpreter;
    this.baseName = this.interpreter.name;
    this.haveSource = true;
  }

  get hasSource() {
    return Boolean(this.haveSource);
  }

  get name() {
    return this.lockedName ? this.lockedName : `${this.namePrefix}${this.baseName}${this.nameSuffix}`;
  }

  get rgb() {
    return this.haveSource && this.interpreter.rgb;
  }

  lock(lockedName) {
    console.debug(`Process name locked: ${lockedName}`);
    this.lockedName = lockedName;
  }

  get locked() {
    return Boolean(this.lockedName);
  }

  get input() {
    return this.haveSource ? this.interpreter.input : this.name;
  }

  get human() {
    if (this.haveSource) {
      return this.locked ? this.lockedName : this.interpreter.human;
    }

    return this.locked ? this.lockedName : this.name;
  }

  get hasAttrs() {
    return Boolean(this.haveAttrs);
  }

  get attrs() {
    return this.attributes;
  }

  set attrs(attr) {
    if (['background', 'bold', 'dim', 'italic', 'invert', 'underline', 'blink'].includes(attr)) {
      this.haveAttrs = true;
      this.attributes[attr] = true;
    }
  }

  addStep(step) {
    this.queue.push(step);
    this.haveQueue = true;
  }

  background() {
    this.attrs = 'background';
    console.debug('Special::background');
  }

  bold() {
    this.attrs = 'bold';
    console.debug('Special::bold');
  }

  dim() {
    this.attrs = 'dim';
    console.debug('Special::dim');
  }

  italic() {
    this.attrs = 'italic';
    console.debug('Special::italic');
  }

  invert() {
    this.attrs = 'invert';
    console.debug('Special::invert');
  }

  underline() {
    this.attrs = 'underline';
    console.debug('Special::underline');
  }

  blink() {
    this.attrs = 'blink';
    console.debug('Special::blink');
  }

  saturate(args) {
    this.addStep(color => color.saturate(args.percent));
    this.namePrefix = `sat-${this.namePrefix}`;
    this.nameSuffix = `${this.nameSuffix}-${args.percent}`;
    console.debug('Process::saturate', args.percent);
  }

  desaturate(args) {
    this.addStep(color => color.desaturate(args.percent));
    this.namePrefix = `des-${this.namePrefix}`;
    this.nameSuffix = `${this.nameSuffix}-${args.percent}`;
    console.debug('Process::desaturate', args.percent);
  }

  darken(args) {
    this.addStep(color => color.darken(args.percent));
    this.namePrefix = `dark-${this.namePrefix}`;
    this.nameSuffix = `${this.nameSuffix}-${args.percent}`;
    console.debug('Process::darken', args.percent);
  }

  lighten(args) {
    this.addStep(color => color.lighten(args.percent));
    this.namePrefix = `light-${this.namePrefix}`;
    this.nameSuffix = `${this.nameSuffix}-${args.percent}`;
    console.debug('Process::lighten', args.percent);
  }

  spin(args) {
    this.addStep(color => color.spin(-args.rotation));
    this.namePrefix = `spin-${this.namePrefix}`;
    this.nameSuffix = `${this.nameSuffix}-${Math.abs(args.rotation)}`;
    console.debug('Process::spin', args.rotation);
  }

  mono() {
    this.addStep(color => color.greyscale());
    this.namePrefix = `mono-${this.namePrefix}`;
    this.nameSuffix = `${this.nameSuffix}}`;
    console.debug('Process::mono');
  }

  mix(args) {
    this.addStep(color => TinyColor.mix(color, args.color, 50));
    this.namePrefix = `mix-${this.namePrefix}`;
    this.nameSuffix = `${this.nameSuffix}-${args.color}`;
    console.debug('Process::mix', args.color);
  }

}

function processor(name) {
  return new Processor(name);
}

class Interpreter {
  constructor(raw) {
    this.source = (raw_ => {
      switch (true) {
        case /^[0-9a-f]{3}$/i.test(raw_):
          return {
            input: /^([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(raw_),
            human: raw_,
            space: 'HEX'
          };

        case /^#[0-9a-f]{3}$/i.test(raw_):
          return {
            input: /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(raw_),
            human: raw_,
            space: '#HEX'
          };

        case /^[0-9a-f]{4}$/i.test(raw_):
          return {
            input: /^([0-9a-f])([0-9a-f])([0-9a-f])[0-9a-f]$/i.exec(raw_),
            human: raw_,
            space: 'HEX'
          };

        case /^#[0-9a-f]{4}$/i.test(raw_):
          return {
            input: /^#([0-9a-f])([0-9a-f])([0-9a-f])[0-9a-f]$/i.exec(raw_),
            human: raw_,
            space: '#HEX'
          };

        case /^[0-9a-f]{6}$/i.test(raw_):
          return {
            input: raw_,
            human: raw_,
            space: 'HEXHEX'
          };

        case /^#[0-9a-f]{6}$/i.test(raw_):
          return {
            input: raw_,
            human: raw_,
            space: '#HEXHEX'
          };

        case /^[0-9a-f]{8}$/i.test(raw_):
          return {
            input: raw_.slice(0, 6),
            human: raw_.slice(0, 6),
            space: 'HEXHEX'
          };

        case /^#[0-9a-f]{8}$/i.test(raw_):
          return {
            input: raw_.slice(0, 7),
            human: raw_.slice(0, 7),
            space: '#HEXHEX'
          };

        case /^rgb[(:]+\s?\d+,\s?\d+,\s?\d+\s?[)]*$/.test(raw_):
          return {
            input: raw_.replace(/rgb[(:]/, '').replace(/[ )]/g, '').split(','),
            human: raw_.replace(/rgb[(:]/, 'rgb-').replace(/,/g, '-').replace(/[ )]/g, ''),
            space: 'RGB'
          };

        case /^hsl:\d+,\d+,\d+$/.test(raw_):
          return {
            input: raw_.replace(/hsl:/, '').split(','),
            human: raw_.replace('hsl:', 'hsl-').replace(/,/g, '-'),
            space: 'HSL'
          };

        case /^hsv:\d+,\d+,\d+$/.test(raw_):
          return {
            input: raw_.replace(/hsv:/, '').split(','),
            human: raw_.replace('hsv:', 'hsv-').replace(/,/g, '-'),
            space: 'HSV'
          };

        case /^hsb:\d+,\d+,\d+$/.test(raw_):
          return {
            input: raw_.replace(/hsb:/, '').split(','),
            human: raw_.replace('hsb:', 'hsb-').replace(/,/g, '-'),
            space: 'HSV'
          };

        case /^hwb:\d+,\d+,\d+$/.test(raw_):
          return {
            input: raw_.replace(/hwb:/, '').split(','),
            human: raw_.replace('hwb:', 'hwb-').replace(/,/g, '-'),
            space: 'HWB'
          };

        case raw_ in {
          normal: 'normal',
          reset: 'reset'
        }:
          return {
            input: raw_,
            human: raw_,
            space: 'SGR'
          };

        case raw_ in names:
          return {
            input: raw_,
            human: raw_,
            space: 'named'
          };

        default:
          throw new Error(`Unrecognised color space: ${raw_}`);
      }
    })(raw);

    const source = (source => {
      switch (source.space) {
        case 'HEX':
        case '#HEX':
          const [input, r, g, b] = source.input;
          return {
            name: `${r}${r}${g}${g}${b}${b}`,
            rgb: converter.hex.rgb(`${r}${r}${g}${g}${b}${b}`),
            input
          };

        case 'HEXHEX':
        case '#HEXHEX':
          return {
            name: source.input,
            rgb: converter.hex.rgb(this.name)
          };

        case 'RGB':
          return {
            name: converter.rgb.hex(source.input),
            rgb: converter.hex.rgb(this.name)
          };

        case 'HSL':
          return {
            name: converter.hsl.hex(source.input),
            rgb: converter.hsl.rgb(source.input)
          };

        case 'HSV':
          return {
            name: converter.hsv.hex(source.input),
            rgb: converter.hsv.rgb(source.input)
          };

        case 'HWB':
          return {
            name: converter.hwb.hex(source.input),
            rgb: converter.hwb.rgb(source.input)
          };

        case 'SGR':
          return {
            name: source.input,
            rgb: source.input
          };

        case 'named':
          return {
            name: converter.keyword.hex(source.input),
            rgb: converter.keyword.rgb(source.input)
          };

        default:
          throw new Error(`Unrecognised color space: ${source.space}`);
      }
    })(this.source);

    if (source.input) {
      this.source.input = source.input;
    }

    this.baseName = source.name;

    if (source.space === 'SGR') {
      this.baseColor = source.name;
    } else {
      this.baseColor = tinycolor(source.rgb ? `rgb(${source.rgb})` : source.name);
    }

    console.debug(`Color (${this.baseName}) ${this.baseColor} from ${this.source.space} as ${this.source.human}`);
  }

  get name() {
    return this.baseName;
  }

  set name(n) {
    this.baseName = n;
  }

  get rgb() {
    return this.baseColor;
  }

  set rgb(rgb) {
    this.baseColor = tinycolor(rgb);
  }

  get input() {
    return this.source.input;
  }

  get human() {
    return this.source.human;
  }

  get space() {
    return this.source.space;
  }

  toString() {
    return converter.rgb.hex(this.baseColor);
  }

}

function interpreter(raw) {
  return new Interpreter(raw);
}

let currentAutoName = 1;
function parse (color) {
  const queue = [];
  let processor$1 = processor(`color_${currentAutoName++}`);

  const refreshProcessor = processor_ => {
    if (processor_.hasSource) {
      queue.push(processor_);
      return processor(`color_${currentAutoName++}`);
    }

    return processor_;
  };

  const tokens = color.split(' ');

  while (tokens.length > 0) {
    const token = tokens.shift();

    switch (token) {
      case 'background':
        processor$1.background();
        break;

      case 'bold':
        processor$1.bold();
        break;

      case 'faint':
        processor$1.dim();
        break;

      case 'dim':
        processor$1.dim();
        break;

      case 'italic':
        processor$1.italic();
        break;

      case 'invert':
        processor$1.invert();
        break;

      case 'underline':
        processor$1.underline();
        break;

      case 'blink':
        processor$1.blink();
        break;

      case 'saturate':
      case 'sat':
        processor$1.saturate({
          percent: tokens.shift()
        });
        break;

      case 'desaturate':
      case 'desat':
        processor$1.desaturate({
          percent: tokens.shift()
        });
        break;

      case 'light':
        processor$1.lighten({
          percent: 20
        });
        break;

      case 'dark':
        processor$1.darken({
          percent: 20
        });
        break;

      case 'lighten':
        processor$1.lighten({
          percent: tokens.shift()
        });
        break;

      case 'darken':
        processor$1.darken({
          percent: tokens.shift()
        });
        break;

      case 'spin':
        processor$1.spin({
          rotation: tokens.shift()
        });
        break;

      case 'mono':
        processor$1.mono();
        break;

      case 'mix':
        processor$1.mix({
          color: tokens.shift()
        });
        break;

      default:
        if (/^[A-Za-z0-9_-]+:$/.test(token)) {
          processor$1 = refreshProcessor(processor$1);
          processor$1.lock(token.trim().replace(':', ''));
        } else {
          processor$1 = refreshProcessor(processor$1);
          processor$1.source = interpreter(token);
        }

    }
  }

  queue.push(processor$1);
  return queue;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

const name = "trucolor";
const version = "1.0.6";
const description = "TTY color toolkit supporting Truecolor (24bit RGB)";
const author = "Mark Griffiths <mark@thebespokepixel.com> (http://thebespokepixel.com/)";
const main = "index.js";
const module = "index.mjs";
const bin = {
	trucolor: "./bin/trucolor"
};
const files = [
	"index.js",
	"index.mjs",
	"bin/"
];
const bugs = {
	url: "https://github.com/thebespokepixel/trucolor/issues"
};
const copyright = {
	year: "2020",
	owner: "The Bespoke Pixel"
};
const config = {
	cli: {
		selected: "direct",
		none: {
			color: "hex",
			background: "",
			bold: "",
			dim: "",
			italic: "",
			underline: "",
			blink: "",
			invert: "",
			reset: "",
			normal: ""
		},
		direct: {
			color: "hex",
			background: "--background",
			bold: "--bold",
			dim: "--dim",
			italic: "--italic",
			underline: "--underline",
			blink: "--blink",
			invert: "--invert",
			reset: "reset",
			normal: "normal"
		},
		fish: {
			color: "hex",
			background: "--background",
			bold: "--bold",
			dim: "",
			italic: "",
			underline: "--underline",
			blink: "",
			invert: "",
			reset: "normal",
			normal: "normal"
		}
	}
};
const dependencies = {
	"@thebespokepixel/es-tinycolor": "^2.0.0",
	"@thebespokepixel/meta": "^2.0.1",
	"@thebespokepixel/string": "^1.0.0",
	"color-convert": "^2.0.1",
	"common-tags": "^1.8.0",
	"escape-string-regexp": "^2.0.0",
	lodash: "^4.17.15",
	"sgr-composer": "^2.0.0",
	"term-ng": "^2.0.0",
	truwrap: "^2.0.0",
	"update-notifier": "^4.1.0",
	verbosity: "^2.0.0",
	yargs: "^15.1.0"
};
const devDependencies = {
	"@ava/babel": "^1.0.1",
	"@babel/core": "^7.8.4",
	"@babel/preset-env": "^7.8.4",
	ava: "^3.3.0",
	"babel-plugin-lodash": "^3.3.4",
	"documentation-theme-bespoke": "^1.1.2",
	gulp: "^4.0.2",
	"gulp-better-rollup": "^4.0.1",
	"gulp-chmod": "^3.0.0",
	"gulp-rename": "^2.0.0",
	nyc: "^15.0.0",
	rollup: "^1.31.1",
	"rollup-plugin-babel": "^4.3.3",
	"rollup-plugin-commonjs": "^10.1.0",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-node-resolve": "^5.2.0",
	"semver-regex": "^3.1.1",
	xo: "^0.26.1"
};
const engines = {
	node: ">=10.0"
};
const homepage = "https://github.com/thebespokepixel/trucolor";
const keywords = [
	"color",
	"24bit",
	"truecolor",
	"SGR",
	"ansi",
	"command line",
	"fish"
];
const license = "MIT";
const repository = {
	type: "git",
	url: "git+https://github.com/thebespokepixel/trucolor.git"
};
const scripts = {
	test: "xo && nyc ava",
	"generate-test-fixtures": "scripts/generate-test-fixtures",
	"generate-test-widths": "scripts/generate-test-widths",
	"doc-serve": "documentation serve --watch --theme node_modules/documentation-theme-bespoke --github --config src/docs/documentation.yml --project-name $npm_package_name  --project-version $npm_package_version src/index.js",
	"doc-build": "documentation build --format html --output docs --theme node_modules/documentation-theme-bespoke --github --config src/docs/documentation.yml --project-name $npm_package_name  --project-version $npm_package_version src/index.js",
	readme: "compile-readme -u src/docs/example.md src/docs/readme.md > readme.md",
	coverage: "nyc ava && nyc report --reporter=lcov --report-dir test/coverage; open test/coverage/lcov-report/index.html"
};
const xo = {
	semicolon: false,
	ignores: [
		"bin/**/*",
		"lib/**/*",
		"docs/**",
		"test/coverage/**",
		"index.js"
	]
};
const ava = {
	babel: true,
	files: [
		"test/*.js"
	]
};
const badges = {
	github: "thebespokepixel",
	npm: "thebespokepixel",
	name: "trucolor",
	codeclimate: "5f8c6c4143841284dc75",
	providers: {
		aux1: {
			title: "github",
			text: "source",
			color: "4E73B6",
			link: "https://github.com/thebespokepixel/trucolor"
		}
	},
	readme: {
		"Publishing Status": [
			[
				"npm",
				"david"
			],
			[
				"travis-com",
				"rollup"
			]
		],
		"Development Status": [
			[
				"greenkeeper",
				"travis-com-dev"
			],
			[
				"david-dev",
				"david-devdeps-dev"
			],
			[
				"snyk",
				"code-climate",
				"code-climate-coverage"
			]
		],
		"Documentation/Help": [
			"inch",
			"twitter"
		]
	},
	docs: [
		[
			"aux1",
			"travis-com"
		],
		[
			"code-climate",
			"code-climate-coverage"
		],
		[
			"snyk",
			"david"
		]
	]
};
var pkg = {
	name: name,
	version: version,
	description: description,
	author: author,
	main: main,
	module: module,
	bin: bin,
	files: files,
	bugs: bugs,
	copyright: copyright,
	config: config,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines,
	homepage: homepage,
	keywords: keywords,
	license: license,
	repository: repository,
	scripts: scripts,
	xo: xo,
	ava: ava,
	badges: badges
};

const colorLevel = terminal.color.level || 0;
function render(processor, options = {}) {
  const {
    format: outputFormat
  } = options;
  const color = processor.render();
  const isReset = ['normal', 'reset'].includes(processor.name);
  const sgrComposer = new SGRcomposer(options.force || colorLevel, Object.assign(processor.attrs, processor.hasSource ? {
    color: isReset ? processor.name : color.toRgbArray()
  } : {}));

  const fieldSelect = () => isReset || !processor.hasSource ? processor.name : false;

  const stringSelect = () => isReset || !processor.hasSource ? '' : false;

  const swatch = () => {
    if (colorLevel > 0) {
      const sgr = sgrComposer.sgr(['bold', 'italic', 'underline', 'invert']);
      return `${sgr.in}\u2588\u2588${sgr.out}`;
    }

    return '$\u2588\u2588';
  };

  const colorOptions = (type => {
    switch (type) {
      case undefined:
        return {};

      case 'default':
        return pkg.config.cli[pkg.config.cli.selected];

      default:
        return pkg.config.cli[global.trucolorCLItype];
    }
  })(global.trucolorCLItype);

  switch (outputFormat) {
    case 'cli':
      return _objectSpread2({
        name: processor.human,
        hex: fieldSelect() || color.toHex(),
        rgb: fieldSelect() || color.toRgbString(),
        toString: () => stringSelect() || `${_remove(_map(processor.attrs, (active, attr) => active === true ? colorOptions[attr] : false)).join(' ')}${processor.hasAttrs ? ' ' : ''}${colorOptions.color === 'hex' ? `${color.toHex()}` : `${color.toRgbArray().join(' ')}`}`,
        toSwatch: () => swatch()
      }, sgrComposer.sgr());

    case 'sgr':
      return _objectSpread2({
        name: processor.human,
        hex: fieldSelect() || color.toHex(),
        rgb: fieldSelect() || color.toRgbString(),
        toString: () => stringSelect() || sgrComposer.sgr().in,
        toSwatch: () => swatch()
      }, sgrComposer.sgr());

    default:
      return _objectSpread2({
        name: processor.human,
        hex: fieldSelect() || color.toHex(),
        rgb: fieldSelect() || color.toRgbString(),
        toString: () => fieldSelect() || color.toHex(),
        toSwatch: () => swatch()
      }, sgrComposer.sgr());
  }
}

class Chalkish {
  constructor(styles) {
    const styleFactory = (collection => {
      Object.keys(styles).forEach(key => {
        styles[key].closeRE = new RegExp(escStringRE(styles[key].out), 'g');
        collection[key] = {
          get: () => makePainter.call(this._styles.concat(key))
        };
      });
      return collection;
    })({});

    const proto = Object.defineProperties(() => {}, styleFactory);

    function applyPaint(content) {
      let i = this._styles.length;

      while (i--) {
        const sgrPair = styles[this._styles[i]];
        content = sgrPair.in + content.replace(sgrPair.closeRE, sgrPair.in) + sgrPair.out;
      }

      return content;
    }

    function makePainter(styles) {
      const painter = (...args) => applyPaint.apply(painter, args);

      painter._styles = styles;
      painter.__proto__ = proto;
      return painter;
    }

    Object.defineProperties(Chalkish.prototype, (collection => {
      Object.keys(styles).forEach(name => {
        collection[name] = {
          get: () => makePainter.call(this, [name])
        };
      });
      return collection;
    })({}));
  }

}

function chalk(palette) {
  return new Chalkish(palette);
}

var simpleObject = {
  white: '#BBB',
  black: '#111',
  red: '#B00',
  green: '#0B0',
  blue: '#44B',
  cyan: '#0BB',
  yellow: '#BB0',
  magenta: '#B0B',
  brightWhite: '#FFF',
  brightRed: '#F33',
  brightGreen: '#3F3',
  brightBlue: '#44F',
  brightCyan: '#3FF',
  brightYellow: '#FF3',
  brightMagenta: '#F3F',
  dim: 'dim',
  bold: 'bold',
  italic: 'italic',
  invert: 'invert',
  example: '#CC99FF',
  command: '#31A0FF',
  argument: '#7DC3FF',
  option: '#C1BA89',
  operator: '#FFFFFF',
  grey: '#808080',
  title: 'bold #80C480',
  normal: 'normal',
  reset: 'reset'
};

const console = createConsole({
  outStream: process.stderr
});
const metadata = meta(__dirname);
function trucolor(color, options = {}) {
  const queue = parse(color);

  if (queue.length > 1) {
    return queue.map(color => render(color, options));
  }

  return render(queue[0], options);
}
function palette(options, palette) {
  return _mapValues(palette, color => trucolor(color, options));
}
function chalkish(palette) {
  return chalk(palette);
}
function simple(options) {
  return palette(options, simpleObject);
}
function simplePalette(options) {
  return palette(options, simpleObject);
}

export { chalkish, console, metadata, palette, parse, render, simple, simplePalette, trucolor };
