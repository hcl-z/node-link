const fs = require('fs-extra');
const path = require('path');

function readPackageJson(packagePath) {
    const packageJsonPath = path.join(packagePath, 'package.json');
    try{
        if(fs.existsSync(packageJsonPath)){
            return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        }
    }catch(e){
        debug(`READ: ${packageJsonPath} error: ${e.message}`);
        return {}
    }
}

module.exports = {
    readPackageJson
}