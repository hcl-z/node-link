const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const { debug, success, info } = require('./logger');
const { readPackageJson } = require('./util');

const HOMEDIR = os.homedir() || process.env.HOME

class NodeLinker {
    constructor(config) {
        this.config = config || {};
        this.storeDir = this.config.storeDir || path.join(HOMEDIR, '.node-link', 'store');
        fs.ensureDirSync(this.storeDir);
    }
    getModuleName(globalLinkPath) {
        const relativePath = path.relative(this.storeDir, globalLinkPath);
        return relativePath;
    }
    async linkBin(src, dest) {
        if (process.platform === 'win32') {
            await cmdShim(src, dest, { createPwshFile: false });
        } else {
            await fs.mkdirp(path.dirname(dest));
            await fs.symlink(src, dest);
            await fs.chmod(dest, '755');
        }
    }

    async link(globalLinkPath, targetPath) {
        const targetProjectPath = targetPath || process.cwd();
        debug(`USE: ${globalLinkPath} -> ${targetProjectPath}`);
        const packageJson = readPackageJson(globalLinkPath);
        const moduleName = this.getModuleName(globalLinkPath);
        const targetModulePath = path.join(targetProjectPath, 'node_modules');
        await fs.ensureDir(targetModulePath);
        let linkPath = path.join(targetModulePath, moduleName);

        if (await fs.pathExists(linkPath)) {
            await fs.remove(linkPath);
        }

        await fs.symlink(globalLinkPath, linkPath, 'junction');

        if (packageJson.bin) {
            const binDir = path.join(targetModulePath, '.bin');
            await fs.ensureDir(binDir);

            for (const [binName, binPath] of Object.entries(packageJson.bin || {})) {
                const binSource = path.join(globalLinkPath, binPath);
                const binTarget = path.join(binDir, binName);

                info(`CREATE BIN: ${binSource} -> ${binTarget}`);

                if (await fs.pathExists(binTarget)) {
                    await fs.remove(binTarget);
                }

                await this.linkBin(binSource, binTarget);
            }
        }
    }

    async unlink(globalLinkPath, targetPath) {
        const targetProjectPath = targetPath || process.cwd();
        debug(`USE: ${globalLinkPath} -> ${targetProjectPath}`);
        const packageJson = readPackageJson(globalLinkPath);
        const moduleName = this.getModuleName(globalLinkPath);
        const targetModulePath = path.join(targetProjectPath, 'node_modules');
        const linkPath = path.join(targetModulePath, moduleName);
        if (fs.existsSync(linkPath) && fs.lstatSync(linkPath).isSymbolicLink()) {
            await fs.remove(linkPath);
        }
        //remove bin
        if (packageJson.bin) {
            const binDir = path.join(targetModulePath, '.bin');
            await fs.ensureDir(binDir);

            for (const binName of Object.keys(packageJson.bin || {})) {
                const binTarget = path.join(binDir, binName);

                info(`REMOVE BIN: ${binTarget}`);

                if (await fs.pathExists(binTarget)) {
                    await fs.remove(binTarget);
                }
            }
        }
        return linkPath;
    }

    async linkGlobal(packagePath) {
        const packageJson = path.join(packagePath, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJson, 'utf8');
        const packageJsonData = JSON.parse(packageJsonContent);
        const packageName = packageJsonData.name;

        debug(`FIND: ${packageName}`);

        const packageNameParts = packageName.split('/');
        const globalLinkDir = path.join(this.storeDir, ...packageNameParts.slice(0, -1));
        await fs.ensureDir(globalLinkDir);

        const linkPath = path.join(globalLinkDir, packageNameParts.at(-1));

        if (fs.existsSync(linkPath)) {
            await fs.remove(linkPath);
        }
        await fs.symlink(packagePath, linkPath, 'junction');
        return linkPath;
    }


    async unlinkGlobal(packagePath) {
        const packageJson = path.join(packagePath, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJson, 'utf8');
        const packageJsonData = JSON.parse(packageJsonContent);
        const packageName = packageJsonData.name;

        debug(`FIND: ${packageName}`);

        const globalLinkDir = await this.searchGlobal(packageName);

        if (fs.existsSync(globalLinkDir) && fs.lstatSync(globalLinkDir).isSymbolicLink()) {
            await fs.remove(globalLinkDir);
        }
        return globalLinkDir;
    }

    async searchGlobal(packageName) {
        const globalLinkDir = path.join(this.storeDir, packageName);
        debug(`SEARCH: ${globalLinkDir}`);
        if (fs.existsSync(globalLinkDir) && fs.lstatSync(globalLinkDir).isSymbolicLink()) {
            return globalLinkDir;
        }
        return null;
    }
}

module.exports = NodeLinker; 