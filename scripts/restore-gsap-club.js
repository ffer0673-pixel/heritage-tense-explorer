import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const backupDir = path.join(projectRoot, 'src', 'lib', 'gsap-backup');
const nodeModulesGsap = path.join(projectRoot, 'node_modules', 'gsap');

function copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${path.relative(projectRoot, src)} -> ${path.relative(projectRoot, dest)}`);
}

function restore() {
    if (!fs.existsSync(nodeModulesGsap)) {
        console.warn('node_modules/gsap does not exist. Skipping restoration of GSAP Club plugins. Make sure npm install runs first.');
        return;
    }

    const filesToCopy = [
        {
            src: path.join(backupDir, 'InertiaPlugin.js'),
            dest: path.join(nodeModulesGsap, 'InertiaPlugin.js')
        },
        {
            src: path.join(backupDir, 'utils', 'VelocityTracker.js'),
            dest: path.join(nodeModulesGsap, 'utils', 'VelocityTracker.js')
        }
    ];

    filesToCopy.forEach(({ src, dest }) => {
        if (fs.existsSync(src)) {
            copyFile(src, dest);
        } else {
            console.error(`Backup file not found: ${path.relative(projectRoot, src)}`);
        }
    });
}

restore();
