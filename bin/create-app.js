const { execSync } = require('child_process');
const path = require('path');
const readlineSync = require('readline-sync');
const fs = require('fs');

if (process.argv.length < 3) {
    console.log('You have to provide a name to your app.');
    console.log('For example :');
    console.log('    npx create-my-boilerplate my-app');
    process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/info-arnav/webpack-cli.git";

try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
    } else {
      console.log(error);
    }
    process.exit(1);
  }

  async function promptForFramework() {
    const frameworks = ['react', 'vue']; 
    const index = readlineSync.keyInSelect(frameworks, 'Choose a framework:');
    if (index === -1) {
        console.log('You must choose a framework.');
        process.exit(1);
    }
    return frameworks[index];
  }
  
  const framework = promptForFramework();

  async function main() {
    try {
      console.log(`Creating webpack-${framework} app.....`)
      console.log('Downloading files...');

      execSync(`git clone --no-checkout --depth 1 ${git_repo} ${projectPath}`);

      process.chdir(projectPath);

      execSync('git config core.sparseCheckout true');
      execSync(`echo "apps/${framework}" >> .git/info/sparse-checkout`);
      execSync('git checkout');

      console.log('Installing dependencies...');
      execSync('npm install');

      console.log('Removing useless files');
      execSync('npx rimraf ./.git');
      fs.rmdirSync(path.join(projectPath, 'bin'), { recursive: true});

      console.log('The installation is done, this is ready to use !');

    } catch (error) {
      console.log(error);
    }
}

main();