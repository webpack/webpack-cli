const { readdirSync } = require('fs');
const { join, resolve, extname } = require('path');

class webpackCLI {
    constructor(args, yargsOptions) {
        this.setGroupMap(yargsOptions);
        this.setArgsMap(args);

        this.processingErrors = [];
        this.groups = [];
    }
    setArgsMap(args) {
        this.args = new Map();
        Object.keys(args.argv).map( arg => {
            this.args.set(arg, {arg: args.argv[arg]});
        });
    }
    setGroupMap(yargsOptions) {
        this.groupMap = new Map();
        Object.keys(yargsOptions).forEach( opt => {
            const groupName = yargsOptions[opt].group;
            let namePrefix;
            if(groupName.length) {
                namePrefix = groupName.slice(0, groupName.length - 9);
                const hasActiveConjgection = namePrefix.slice(namePrefix.length - 3);
                if(hasActiveConjgection === "ing") {
                    namePrefix = (namePrefix.slice(0, namePrefix.length - 3) + "e");
                }
            } else {
                // handle generally
            }
            let pushToMap;
            namePrefix = namePrefix.toLowerCase();
            if(this.groupMap.has(namePrefix)) {
                pushToMap = this.groupMap.get(namePrefix);
                pushToMap.push(opt)
            } else {
                this.groupMap.set(namePrefix, [opt]);
            }
        })
    }
    async formatDashedArgs() {
    }

    async getGroups() {
        const groupDirectory = join(__dirname, 'groups');
        const groups = readdirSync(groupDirectory).map( file => {
          /*   const fileName = file.replace(extname(file), '');
            const mapForGroup = this.groupMap.get(fileName); */
            return resolve(groupDirectory, file);
        });
        return groups;
    }

    

    async run() {
        this.groups = await this.getGroups();
        // TODO: filter groups based on args 
        await this.formatDashedArgs();
        return {
            webpackOptions: {},
            processingErrors: []
        }
    }
}


module.exports = webpackCLI