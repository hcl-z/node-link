#!/usr/bin/env node
const { program } = require('commander');
const NodeLinker = require('../lib/node-linker');
const path = require('path');
const fs = require('fs');
const { debug, success, error } = require('../lib/logger');

// TODO: config
const nodeLinker = new NodeLinker();

program
    .name('node-link')
    .description('跨包管理器的 Node.js 包链接工具')
    .version('1.0.0');

program
    .command('link [target]')
    .action(async (target) => {
        try {
            if (!target) {
                const linkPath = await nodeLinker.linkGlobal(process.cwd());
                success(`LINK: ${linkPath} -> global`);
            } else {
                if (target.startsWith('./') || target.startsWith('/')) {
                    //todo
                } else {
                    const globalLinkPath = await nodeLinker.searchGlobal(target);
                    debug(`GLOBAL: ${globalLinkPath}`);
                    if (globalLinkPath) {
                        await nodeLinker.link(globalLinkPath, process.cwd())
                    }
                }
            }
        } catch (err) {
            error(`LINK FAILED: ${err.message}`);
            process.exit(1);
        }
    });

program
    .command('unlink [target]')
    .action(async (target) => {
        try {
            if (!target) {
                const globalLinkPath = await nodeLinker.unlinkGlobal(process.cwd());
                success(`UNLINK: ${globalLinkPath}->`);
            } else {
                if (target.startsWith('./') || target.startsWith('/')) {
                    //todo
                } else {
                    const globalLinkPath = await nodeLinker.searchGlobal(target);
                    debug(`GLOBAL: ${globalLinkPath}`);
                    if (globalLinkPath) {
                        await nodeLinker.unlink(globalLinkPath, process.cwd())
                    }
                }
            }
        } catch (err) {
            error(`UNLINK FAILED: ${err.message}`);
            process.exit(1);
        }
    });

program.parse(process.argv); 