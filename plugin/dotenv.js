const interpolate = (env, vars) => {
    const matches = env.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || [];
  
    matches.forEach((match) => {
      const key = match.replace(/\$|{|}/g, '');
      let variable = vars[key] || '';
      variable = interpolate(variable, vars);
      env = env.replace(match, variable);
    });
  
    return env;
  };
  
  class DotEnvPlugin {
    constructor() {
    }
  
    apply(compiler) {
      compiler.hooks.emit.tap('DotEnvPlugin', (compilation) => {
        const assets = compilation.assets;
        Object.keys(assets).forEach((assetName) => {
          let asset = assets[assetName];
          asset.source = this.replaceProcessEnv(asset.source);
        });
      });
    }
  
    replaceProcessEnv(source) {
      const envRegex = /process\.env\.([a-zA-Z0-9_]+)/g;
      return interpolate(source, process.env);
    }
  }
  
  module.exports = DotEnvPlugin;
  