/**
 * Centralized Environment Configuration
 * 
 * Defines the base URLs for different execution environments.
 * usage: set TEST_ENV=staging (default) to switch environments.
 */

export type EnvName = 'dev' | 'staging' | 'prod';

export const environments: Record<EnvName, string> = {
    dev: 'https://dev.example.com',
    staging: 'https://staging-rq8v6p5n.tle-eliminators.com/',
    prod: 'https://www.tle-eliminators.com',

};

export const getBaseUrl = (): string => {
    const env = (process.env.TEST_ENV as EnvName) || 'prod';
    if (!environments[env]) {
        throw new Error(`Invalid TEST_ENV: ${env}. Available: ${Object.keys(environments).join(', ')}`);
    }
    return environments[env];
};
