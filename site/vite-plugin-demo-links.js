// Vite Plugin: Generate Demo Links
import { resolve } from 'path';
import { readdirSync } from 'fs';

export default function demoLinksPlugin() {
    const virtualModuleId = 'virtual:demo-links';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'vite-plugin-demo-links',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                const demosDir = resolve(__dirname, '../demo');
                const demoFolders = readdirSync(demosDir, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);

                const demoLinks = demoFolders.map(name => ({
                    name,
                    path: `./demo/${name}/`,
                }));

                return `export default ${JSON.stringify(demoLinks, null, 2)};`;
            }
        },
    };
}
