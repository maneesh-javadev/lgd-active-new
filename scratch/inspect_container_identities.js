const { execSync } = require('child_process');

const containerNames = [
    'api-gateway',
    'auth-service',
    'revenue',
    'user-management',
    '7f3a1bb29b10_service-discovery',
    'redis'
];

const results = {};

for (const name of containerNames) {
    try {
        const inspectRaw = execSync(`docker inspect ${name}`, { encoding: 'utf8' });
        const data = JSON.parse(inspectRaw)[0];
        const imageId = data.Image;
        const imgInspectRaw = execSync(`docker image inspect ${imageId}`, { encoding: 'utf8' });
        const imgData = JSON.parse(imgInspectRaw)[0];

        results[name] = {
            containerName: data.Name.replace(/^\//, ''),
            containerId: data.Id,
            containerIdShort: data.Id.substring(0, 12),
            imageId: imgData.Id,
            imageIdShort: imgData.Id.replace('sha256:', '').substring(0, 12),
            repoTags: imgData.RepoTags || [],
            repoDigests: imgData.RepoDigests || [],
            digestType: (imgData.RepoDigests && imgData.RepoDigests.length > 0) ? 'Docker/OCI Manifest sha256' : 'Local Image ID sha256',
            status: data.State.Status,
            created: data.Created,
            ports: data.NetworkSettings.Ports
        };
    } catch (e) {
        results[name] = { error: e.message };
    }
}

console.log(JSON.stringify(results, null, 2));
