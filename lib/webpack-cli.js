const { join } = require('path');
const ErrorHelper = require('./utils/error-helper');

class webpackCLI extends ErrorHelper {
    constructor() {
        super();
        this.groupMap = new Map();
        this.groups = [];
        this.processingErrors = [];
    }
     setMappedGroups(args, yargsOptions) {
        const {_all} = args; 
        Object.keys(_all).forEach( key => {
            this.setGroupMap(key, _all[key], yargsOptions);
        });
    }
    setGroupMap(key, val, yargsOptions) {
        const opt = yargsOptions.find(opt => opt.name === key);
        const groupName = opt.group;
        const namePrefix = groupName.slice(0, groupName.length - 9).toLowerCase();
        if(this.groupMap.has(namePrefix)) {
            const pushToMap = this.groupMap.get(namePrefix);
            pushToMap.push({[opt.name]: val})
        } else {
            this.groupMap.set(namePrefix, [{[opt.name]: val}]);
        }
    }
    formatDashedArgs() {
    }

    resolveGroups() {
        for (const [key, value] of this.groupMap.entries()) {
            const fileName = join(__dirname, 'groups', key);
            const GroupClass = require(fileName);
            const GroupInstance = new GroupClass(value);
            this.groups.push(GroupInstance);
        }
    }

    runOptionGroups() {
        return this.arrayToObject(this.groups.map( Group => Group.run()).filter(e => e));
    }

    async run(args, yargsOptions) {
        await this.setMappedGroups(args, yargsOptions);
        await this.resolveGroups();
        const res = await this.runOptionGroups();
        
        return {
            webpackOptions: res,
            processingErrors: []
        }
    }
}


module.exports = webpackCLI