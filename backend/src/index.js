const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!match || Object.prototype.hasOwnProperty.call(process.env, match[1])) continue;

        const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
        process.env[match[1]] = value;
    }
}

const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
