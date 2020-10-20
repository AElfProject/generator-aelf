const Generator = require('yeoman-generator');
const inquirer = require('inquirer');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const mkdirp = require('mkdirp');

const MONO_PROMPTS = {
  web: [
    {
      type: 'number',
      name: 'localPort',
      message: 'Please input local developing sever port for front end',
      default: 9800
    },
    {
      type: 'input',
      name: 'outputPath',
      message: 'Please input the output path of web',
      default: '/'
    }
  ],
  api: [
    {
      type: 'number',
      name: 'serverPort',
      message: 'Please input sever port for API',
      default: 7200
    }
  ],
  scan: []
};

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  prompting() {
    this.log(
      yosay(`Welcome to
        ${chalk.red('aelf')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Please input your project directory name, such as aelf-web',
        default: ''
      },
      {
        type: 'input',
        name: 'name',
        message: 'Please input your project namespace, such as demo',
        default: 'demo'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please input project description:',
        default: ''
      },
      {
        type: 'input',
        name: 'author',
        message: '"Author\'s Name"',
        default: ''
      },
      {
        type: 'input',
        name: 'email',
        message: '"Author\'s Email"',
        default: ''
      },
      {
        type: 'input',
        name: 'license',
        message: 'License',
        default: 'MIT'
      },
      {
        type: 'checkbox',
        name: 'includes',
        message: 'Please select the functionalities:',
        choices:
          [
            new inquirer.Separator('--- Front end ---'),
            'web',
            new inquirer.Separator('--- API Server ---'),
            'api',
            new inquirer.Separator('--- Chain Scanner ---'),
            'scan'
          ],
        default: ['web']
      },
      {
        type: 'input',
        name: 'endpoint',
        message: `Please input the URL of chain server, such as ${chalk.bgGreen('http://127.0.0.1:8000')}`,
        default: 'http://127.0.0.1:8000'
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = {
        ...props
      };
      return this._promptingMonoOptions();
    });
  }

  needORM() {
    return this.props.includes.filter(v => v === 'api' || v === 'scan').length > 0;
  }

  _promptingMonoOptions() {
    const {
      includes = []
    } = this.props;
    if (includes.length === 0) {
      this.log.error('Please select a functionality');
      throw new Error('Please select a functionality');
    }
    let prompts = includes.reduce((acc, key) => [...acc, ...MONO_PROMPTS[key]], []);
    if (this.needORM()) {
      prompts = [
        ...prompts,
        {
          type: 'input',
          name: 'database',
          message: 'Please input database name',
          default: `aelf-${this.props.name}`
        }
      ];
    }
    return this.prompt(prompts).then(props => {
      this.props = {
        ...this.props,
        ...props
      };
      console.log(this.props);
    });
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.projectName) {
      mkdirp(this.props.projectName);
      this.destinationRoot(this.destinationPath(this.props.projectName));
    }
  }

  writing() {
    this.log('\nGenerating...\n');
    this._writeScript();
    this._writeRelated();
    this._writingAPI();
    this._writingWeb();
    this._writingScan();
    if (this.needORM()) {
      this._writingORM();
    }
  }

  _copyTemplate(prefixFrom, prefixTo, copies = []) {
    copies.forEach(v => {
      this.fs.copyTpl(
        this.templatePath(`${prefixFrom}/${v.from}`),
        this.destinationPath(`${prefixTo}/${v.to || v.from}`),
        {
          ...(v.props || {}),
          ...this.props
        }
      );
    });
  }

  _writingWeb() {
    const {
      name,
      includes
    } = this.props;
    if (includes.filter(v => v === 'web').length > 0) {
      this.fs.copy(
        this.templatePath('packages/web/'),
        this.destinationPath(`packages/${name}/`)
      );
      const webCopies = [
        {
          from: 'package.json'
        },
        {
          from: '.browserslistrc'
        },
        {
          from: '.eslintignore'
        },
        {
          from: '.eslintrc'
        },
        {
          from: '.gitignore'
        },
        {
          from: 'postcss.config.js'
        },
        {
          from: 'README.md'
        },
        {
          from: 'build/proxy.json',
          props: {
            serverPort: 8000
          }
        },
        {
          from: 'build/config.js'
        },
        {
          from: 'build/util.js'
        },
        {
          from: 'build/webpack.dev.js'
        }
      ];
      this._copyTemplate('packages/web', `packages/${name}`, webCopies);
    }
  }

  _writingORM() {
    const {
      name
    } = this.props;
    this.fs.copy(
      this.templatePath('packages/orm/'),
      this.destinationPath(`packages/${name}-orm/`)
    );
    const ormCopies = [
      {
        from: 'package.json'
      },
      {
        from: '.sequelizerc'
      }
    ];
    this._copyTemplate('packages/orm', `packages/${name}-orm`, ormCopies);
  }

  _writingAPI() {
    const {
      name,
      includes
    } = this.props;
    if (includes.filter(v => v === 'api').length > 0) {
      this.fs.copy(
        this.templatePath('packages/api/'),
        this.destinationPath(`packages/${name}-api/`)
      );
      const apiCopies = [
        {
          from: 'package.json'
        },
        {
          from: 'README.md'
        },
        {
          from: 'app/router.js'
        },
        {
          from: 'app.js'
        },
        {
          from: '.eslintrc'
        },
        {
          from: '.gitignore'
        }
      ];
      this._copyTemplate('packages/api', `packages/${name}-api`, apiCopies);
    }
  }

  _writingScan() {
    const {
      name,
      includes
    } = this.props;
    if (includes.filter(v => v === 'scan').length > 0) {
      this.fs.copy(
        this.templatePath('packages/scan/'),
        this.destinationPath(`packages/${name}-scan/`)
      );
      const scanCopies = [
        {
          from: 'package.json'
        }
      ];
      this._copyTemplate('packages/scan', `packages/${name}-scan`, scanCopies);
    }
  }

  _writeScript() {
    this.fs.copy(
      this.templatePath('scripts/'),
      this.destinationPath('scripts/')
    );
  }

  _writeRelated() {
    const {
      includes
    } = this.props;
    this.fs.copy(
      this.templatePath('.browserslistrc'),
      this.destinationPath('.browserslistrc')
    );
    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore')
    );
    this.fs.copy(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    );
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copy(
      this.templatePath('babel.config.js'),
      this.destinationPath('babel.config.js')
    );
    this.fs.copy(
      this.templatePath('postcss.config.js'),
      this.destinationPath('postcss.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('config.dev.json.ejs'),
      this.destinationPath('config.dev.json'),
      {
        ...this.props
      }
    );
    this.fs.copyTpl(
      this.templatePath('config.prod.json.ejs'),
      this.destinationPath('config.prod.json'),
      {
        ...this.props
      }
    );
    this.fs.copy(
      this.templatePath('config.js'),
      this.destinationPath('config.js')
    );
    this.fs.copy(
      this.templatePath('config.json'),
      this.destinationPath('config.json')
    );
    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('package.json'),
      {
        ...this.props,
        hasApi: includes.filter(v => v === 'api').length > 0,
        hasScan: includes.filter(v => v === 'scan').length > 0
      }
    );
  }

  install() {
    this.log('\nInstalling...\n');
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }
};
