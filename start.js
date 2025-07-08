#!/usr/bin/env node

/**
 * start.js - Main launcher for JSON Utils application
 * 
 * This script provides an easy way to start the JSON Utils application.
 * It handles dependency checks and starts Vite without requiring any batch files.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('JSON Utils Application');
console.log('=====================');
console.log('');

// Check if a dependency is installed
function checkDependency(name) {
    try {
        require.resolve(name);
        return true;
    } catch (e) {
        return false;
    }
}

// Main function to start the server
async function main() {
    try {
        // Check for Vite
        if (!checkDependency('vite')) {
            console.log('Installing Vite...');
            execSync('npm install vite@4.5.1 --no-save', {
                stdio: 'inherit',
                cwd: __dirname
            });
        }

        // Set environment variables
        process.env.NODE_OPTIONS = '--no-experimental-fetch';

        console.log('Starting Vite development server...');
        console.log('');
        console.log('The application will be available at:');
        console.log('  http://localhost:3000');
        console.log('');
        console.log('Press Ctrl+C to stop the server.');
        console.log('');

        // Start Vite using npx
        const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
        const vite = spawn(npx, ['vite', '--port', '3000'], {
            stdio: 'inherit',
            cwd: __dirname,
            env: {
                ...process.env,
                NODE_OPTIONS: '--no-experimental-fetch'
            }
        });

        // Handle process exit
        vite.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Server stopped with code ${code}`);
                process.exit(code);
            }
        });

        // Handle process error
        vite.on('error', (error) => {
            console.error('Failed to start server:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('Error starting the application:', error);
        process.exit(1);
    }
}

// Start the application
main();
