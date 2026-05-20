require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuración desde variables de entorno
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ICA_API_KEY || 'sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs';
const WORKFLOW_ID = process.env.ICA_WORKFLOW_ID || 'e216a392-2d89-45a0-9702-df9152a81827';
const API_ENDPOINT = process.env.ICA_API_ENDPOINT || 'https://langflow.servicesessentials.ibm.com/api/v1/run';

console.log('🚀 Servidor iniciando...');
console.log('📍 Puerto:', PORT);
console.log('🔑 API Key configurada:', API_KEY ? 'Sí ✓' : 'No ✗');
console.log('🆔 Workflow ID:', WORKFLOW_ID);

// Tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

const server = http.createServer(async (req, res) => {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Endpoint del proxy para el API de ICA
    if (req.url === '/api/search-recipes' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { ingredients } = JSON.parse(body);
                
                // Preparar el payload para ICA
                const payload = {
                    "output_type": "chat",
                    "input_type": "chat",
                    "input_value": ingredients,
                    "session_id": crypto.randomUUID()
                };

                console.log('Enviando petición a ICA:', payload);

                // Hacer la petición al workflow de ICA
                const workflowUrl = `${API_ENDPOINT}/${WORKFLOW_ID}`;
                console.log('URL del workflow:', workflowUrl);
                
                const response = await fetch(workflowUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                console.log('Respuesta de ICA completa:', JSON.stringify(data, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));

            } catch (error) {
                console.error('Error en el proxy:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Error al procesar la solicitud',
                    message: error.message 
                }));
            }
        });
        return;
    }

    // Servir archivos estáticos
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Error del servidor: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📝 Abre tu navegador en http://localhost:${PORT}`);
    console.log(`🔌 Proxy API configurado en /api/search-recipes`);
});

// Made with Bob
