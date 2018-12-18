// const testRequireError = require(`../utils/test-require-error`).default;
import { get as levenGet, } from 'fast-levenshtein';
import { readdir as fsReaddir } from 'fs-extra';
import chalk from 'chalk';
import { join } from 'path';
import * as existsSync from 'fs-exists-cached';

function isNearMatch(
    fileName: string,
    configName: string,
    distance: number
): boolean {
    return levenGet(fileName, configName) <= distance;
}

module.exports = async function getConfigFile(
    rootDir: string,
    configName: string,
    distance: number = 3
) {
    const configPath = join(rootDir, configName);
    let configModule;
    try {
        configModule = require(configPath);
    } catch (err) {
        const nearMatch = await fsReaddir(rootDir).then(files =>
            files.find(file => {
                const fileName = file.split(rootDir).pop();
                return isNearMatch(fileName, configName, distance);
            })
        );
        // if (!testRequireError(configPath, err)) {
        //     console.log(
        //         `We encountered an error while trying to load your site's ${configName}. Please fix the error and try again.`,
        //         err
        //     );
        // } else if
        if (nearMatch) {
            console.log(
                `It looks like you were trying to add the config file? Please rename "${chalk.bold(
                    nearMatch
                )}" to "${chalk.bold(configName)}"`
            );
        } else if (existsSync(join(rootDir, `src`, configName))) {
            console.log(
                `Your ${configName} file is in the wrong place. You've placed it in the src/ directory.
                It must instead be at the root of your site next to your package.json file.`
            );
        }
    }

    return configModule;
};
