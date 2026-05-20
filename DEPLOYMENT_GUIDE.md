# 🚀 Guía de Despliegue - Aplicación de Recetas ICA

Esta guía te muestra cómo desplegar tu aplicación en diferentes plataformas para hacerla pública.

---

## 📋 Tabla de Contenidos
1. [Preparación Previa](#preparación-previa)
2. [Opción 1: Render (Recomendado - Gratis)](#opción-1-render-recomendado---gratis)
3. [Opción 2: Railway (Gratis con límites)](#opción-2-railway-gratis-con-límites)
4. [Opción 3: Heroku (Pago)](#opción-3-heroku-pago)
5. [Opción 4: Vercel (Requiere adaptación)](#opción-4-vercel-requiere-adaptación)
6. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)

---

## 🔧 Preparación Previa

### 1. Asegurar el código para producción

Primero, necesitas proteger tu API key. Modifica `server.js`:

```javascript
require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Usar variables de entorno
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ICA_API_KEY || '4546ef2810f844e3a46e56b3b873deef';
const WORKFLOW_ID = process.env.ICA_WORKFLOW_ID || 'e216a392-2d89-45a0-9702-df9152a81827';
const API_ENDPOINT = process.env.ICA_API_ENDPOINT || 'https://langflow.servicesessentials.ibm.com/api/v1/run';

// ... resto del código
```

### 2. Instalar dotenv

```bash
npm install dotenv
```

### 3. Crear archivo `.env` (NO subir a GitHub)

```env
ICA_API_KEY=sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs
ICA_WORKFLOW_ID=e216a392-2d89-45a0-9702-df9152a81827
ICA_API_ENDPOINT=https://langflow.servicesessentials.ibm.com/api/v1/run
PORT=3000
```

### 4. Crear archivo `.env.example` (SÍ subir a GitHub)

```env
ICA_API_KEY=tu-api-key-aqui
ICA_WORKFLOW_ID=tu-workflow-id-aqui
ICA_API_ENDPOINT=https://langflow.servicesessentials.ibm.com/api/v1/run
PORT=3000
```

### 5. Actualizar `package.json`

Asegúrate de tener estos scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 🎯 Opción 1: Render (Recomendado - Gratis)

**Ventajas**: Gratis, fácil de usar, SSL automático, buena para Node.js

### Pasos:

1. **Crear cuenta en Render**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Conectar repositorio**
   - Haz clic en "New +" → "Web Service"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `recetas-app-ica`

3. **Configurar el servicio**
   - **Name**: `recetas-app-ica` (o el nombre que prefieras)
   - **Region**: Elige la más cercana
   - **Branch**: `main`
   - **Root Directory**: (dejar vacío)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **Agregar variables de entorno**
   - En la sección "Environment Variables", agrega:
     ```
     ICA_API_KEY = sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs
     ICA_WORKFLOW_ID = e216a392-2d89-45a0-9702-df9152a81827
     ICA_API_ENDPOINT = https://langflow.servicesessentials.ibm.com/api/v1/run
     ```

5. **Desplegar**
   - Haz clic en "Create Web Service"
   - Render automáticamente construirá y desplegará tu app
   - Recibirás una URL como: `https://recetas-app-ica.onrender.com`

6. **Actualizaciones automáticas**
   - Cada vez que hagas `git push` a GitHub, Render actualizará automáticamente

**Nota**: El plan gratuito de Render puede "dormir" después de 15 minutos de inactividad. La primera carga después de dormir puede tardar 30-60 segundos.

---

## 🚂 Opción 2: Railway (Gratis con límites)

**Ventajas**: Muy fácil, $5 de crédito gratis mensual, despliegue rápido

### Pasos:

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Regístrate con GitHub

2. **Crear nuevo proyecto**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Elige tu repositorio `recetas-app-ica`

3. **Configurar variables de entorno**
   - Ve a la pestaña "Variables"
   - Agrega:
     ```
     ICA_API_KEY = sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs
     ICA_WORKFLOW_ID = e216a392-2d89-45a0-9702-df9152a81827
     ICA_API_ENDPOINT = https://langflow.servicesessentials.ibm.com/api/v1/run
     ```

4. **Generar dominio**
   - Ve a "Settings" → "Networking"
   - Haz clic en "Generate Domain"
   - Recibirás una URL como: `https://recetas-app-ica.up.railway.app`

5. **Desplegar**
   - Railway desplegará automáticamente
   - Cada push a GitHub actualizará la app

**Límites del plan gratuito**: $5 de crédito mensual (suficiente para proyectos pequeños)

---

## 🟣 Opción 3: Heroku (Pago)

**Nota**: Heroku eliminó su plan gratuito en 2022. Ahora requiere pago.

**Ventajas**: Muy confiable, escalable, muchas integraciones

### Pasos:

1. **Crear cuenta en Heroku**
   - Ve a https://heroku.com
   - Regístrate y agrega método de pago

2. **Instalar Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Descarga desde: https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Login y crear app**
   ```bash
   heroku login
   heroku create recetas-app-ica
   ```

4. **Configurar variables de entorno**
   ```bash
   heroku config:set ICA_API_KEY=sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs
   heroku config:set ICA_WORKFLOW_ID=e216a392-2d89-45a0-9702-df9152a81827
   heroku config:set ICA_API_ENDPOINT=https://langflow.servicesessentials.ibm.com/api/v1/run
   ```

5. **Desplegar**
   ```bash
   git push heroku main
   ```

6. **Abrir app**
   ```bash
   heroku open
   ```

**Costo**: Desde $7/mes por dyno básico

---

## ▲ Opción 4: Vercel (Requiere adaptación)

**Nota**: Vercel está optimizado para aplicaciones serverless. Requiere modificar la arquitectura.

**Ventajas**: Gratis, muy rápido, excelente para frontend

### Limitación:
Vercel no soporta servidores Node.js tradicionales. Necesitarías:
1. Convertir `server.js` a funciones serverless
2. O usar solo el frontend y llamar directamente al API de ICA (con riesgo de exponer la API key)

**No recomendado para este proyecto** debido a la necesidad del servidor proxy.

---

## 🔐 Configuración de Variables de Entorno

### ¿Por qué usar variables de entorno?

- **Seguridad**: No expones API keys en el código
- **Flexibilidad**: Diferentes valores para desarrollo/producción
- **Mejores prácticas**: Estándar de la industria

### Cómo funcionan:

1. **Desarrollo local**: Usa archivo `.env`
2. **Producción**: Configura en la plataforma de hosting

### Verificar que funcionan:

Agrega esto temporalmente en `server.js`:

```javascript
console.log('API Key configurada:', API_KEY ? 'Sí ✓' : 'No ✗');
console.log('Workflow ID:', WORKFLOW_ID);
```

---

## 📊 Comparación de Plataformas

| Plataforma | Precio | Facilidad | SSL | Auto-deploy | Recomendado |
|------------|--------|-----------|-----|-------------|-------------|
| **Render** | Gratis | ⭐⭐⭐⭐⭐ | ✓ | ✓ | ✅ Sí |
| **Railway** | $5/mes gratis | ⭐⭐⭐⭐⭐ | ✓ | ✓ | ✅ Sí |
| **Heroku** | Desde $7/mes | ⭐⭐⭐⭐ | ✓ | ✓ | ⚠️ Si tienes presupuesto |
| **Vercel** | Gratis | ⭐⭐⭐ | ✓ | ✓ | ❌ No compatible |

---

## 🔍 Verificación Post-Despliegue

Después de desplegar, verifica:

1. **La app carga correctamente**
   - Abre la URL proporcionada
   - Verifica que la interfaz se vea bien

2. **La búsqueda funciona**
   - Ingresa ingredientes de prueba
   - Verifica que las recetas se muestren

3. **Los logs no muestran errores**
   - En Render: Ve a "Logs"
   - En Railway: Ve a "Deployments" → "View Logs"

4. **SSL está activo**
   - La URL debe comenzar con `https://`
   - El navegador debe mostrar el candado 🔒

---

## 🆘 Solución de Problemas Comunes

### Error: "Application Error"
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de la plataforma
- Asegúrate de que `npm start` funcione localmente

### Error: "Cannot find module"
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que el comando de build sea `npm install`

### La app se carga pero no busca recetas
- Verifica las variables de entorno en la plataforma
- Revisa los logs para ver errores de API
- Confirma que la API key sea válida

### La app "duerme" (Render free tier)
- Es normal en el plan gratuito
- La primera carga después de inactividad tarda ~30-60 segundos
- Considera usar un servicio de "ping" para mantenerla activa

---

## 📝 Checklist de Despliegue

- [ ] Código actualizado con variables de entorno
- [ ] Archivo `.env` creado localmente (NO subir a GitHub)
- [ ] Archivo `.env.example` creado (SÍ subir a GitHub)
- [ ] `package.json` tiene script `start`
- [ ] Código subido a GitHub
- [ ] Cuenta creada en plataforma de hosting
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas en la plataforma
- [ ] App desplegada exitosamente
- [ ] Prueba de búsqueda realizada
- [ ] URL compartida con usuarios

---

## 🎓 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Guía de variables de entorno en Node.js](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs)
- [Mejores prácticas de seguridad para APIs](https://owasp.org/www-project-api-security/)

---

## 💡 Recomendación Final

**Para este proyecto, recomiendo usar Render**:
- ✅ Completamente gratis
- ✅ Muy fácil de configurar
- ✅ SSL automático
- ✅ Despliegue automático desde GitHub
- ✅ Logs accesibles
- ✅ Perfecto para aplicaciones Node.js

**Tiempo estimado de despliegue**: 10-15 minutos