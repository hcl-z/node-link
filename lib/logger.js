const {redBright,yellowBright,greenBright,blueBright,magentaBright,cyanBright,whiteBright, bgCyanBright, bgGreenBright, bgRedBright, bgYellowBright, bold, red, white, black, bgBlueBright}=require('colorette')

function log(message, color) {
    console.log(color(message));
}

function debug(message) {
    // if(process.env.DEBUG||process.env.NODE_ENV==='development') {
        log(`${bgCyanBright(bold(' DEBUG '))} ${message}`,cyanBright);
    // }
}

function info(message) {
    log(`${bold(bgBlueBright(bold(' INFO ')))} ${message}`, blueBright);
}

function error(message) {
    log(`${bold(bgRedBright(bold(' ERROR ')))} ${message}`, redBright);
}

function warn(message) {
    log(`${bold(bgYellowBright(bold(' WARN ')))} ${message}`, yellowBright);
}

function success(message) {
    log(`${bold(bgGreenBright(bold(' SUCCESS ')))} ${message}`, greenBright);
}

module.exports = {
    log,
    debug,
    info,
    error,
    warn,
    success
}