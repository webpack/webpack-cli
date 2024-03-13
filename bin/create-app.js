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
      console.log(`Creating ${framework} app.....`)
      console.log('Copying files...');

      execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

      process.chdir(projectPath);

      console.log('Installing dependencies...');
      execSync('npm install');

      console.log('Removing useless files');
      execSync('npx rimraf ./.git');
      fs.rmdirSync(path.join(projectPath, 'bin'), { recursive: true});

      console.log('The installation is done, this is ready to use !');

    // instead just create new files or copy them from the apps directory

    } catch (error) {
      console.log(error);
    }
}

main();