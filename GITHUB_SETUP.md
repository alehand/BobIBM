# 📋 Guía para Subir el Proyecto a GitHub

## Paso 1: Verificar Git
Primero, verifica que tienes Git instalado:
```bash
git --version
```

Si no está instalado, descárgalo desde: https://git-scm.com/downloads

## Paso 2: Inicializar el Repositorio Local
Abre la terminal en la carpeta del proyecto y ejecuta:
```bash
git init
```

## Paso 3: Configurar Git (si es primera vez)
Si es tu primera vez usando Git, configura tu nombre y email:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## Paso 4: Agregar Archivos al Staging
Agrega todos los archivos del proyecto:
```bash
git add .
```

## Paso 5: Hacer el Primer Commit
Crea el primer commit con un mensaje descriptivo:
```bash
git commit -m "Initial commit: Aplicación de búsqueda de recetas con ICA"
```

## Paso 6: Crear Repositorio en GitHub
1. Ve a https://github.com
2. Inicia sesión en tu cuenta
3. Haz clic en el botón **"+"** en la esquina superior derecha
4. Selecciona **"New repository"**
5. Completa los datos:
   - **Repository name**: `recetas-app-ica` (o el nombre que prefieras)
   - **Description**: "Aplicación web para buscar recetas basada en ingredientes usando IBM ICA"
   - **Visibility**: Elige "Public" o "Private"
   - **NO marques** "Initialize this repository with a README" (ya tienes uno)
6. Haz clic en **"Create repository"**

## Paso 7: Conectar Repositorio Local con GitHub
GitHub te mostrará comandos. Usa estos (reemplaza con tu URL):
```bash
git remote add origin https://github.com/TU-USUARIO/recetas-app-ica.git
git branch -M main
git push -u origin main
```

**Nota**: Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

## Paso 8: Verificar
Ve a tu repositorio en GitHub y verifica que todos los archivos se hayan subido correctamente.

---

## 🔄 Comandos para Actualizaciones Futuras

Cuando hagas cambios en el proyecto:

1. **Ver archivos modificados**:
```bash
git status
```

2. **Agregar cambios**:
```bash
git add .
```

3. **Hacer commit**:
```bash
git commit -m "Descripción de los cambios"
```

4. **Subir a GitHub**:
```bash
git push
```

---

## ⚠️ Importante: Seguridad

**NUNCA subas información sensible a GitHub:**
- El archivo `.gitignore` ya está configurado para excluir `node_modules/` y archivos `.env`
- Si necesitas usar variables de entorno (como API keys), créalas en un archivo `.env` y agrégalas al `.gitignore`
- Para este proyecto, considera mover la API key a variables de entorno

### Ejemplo de uso de variables de entorno:

1. Crea un archivo `.env` en la raíz del proyecto:
```
ICA_API_KEY=sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs
ICA_WORKFLOW_ID=e216a392-2d89-45a0-9702-df9152a81827
```

2. Instala dotenv:
```bash
npm install dotenv
```

3. Modifica `server.js` para usar las variables:
```javascript
require('dotenv').config();
const apiKey = process.env.ICA_API_KEY;
const workflowId = process.env.ICA_WORKFLOW_ID;
```

4. Crea un archivo `.env.example` (este SÍ se sube a GitHub):
```
ICA_API_KEY=tu-api-key-aqui
ICA_WORKFLOW_ID=tu-workflow-id-aqui
```

---

## 📝 Estructura del Proyecto

```
recetas-app-ica/
├── index.html          # Interfaz de usuario
├── styles.css          # Estilos de la aplicación
├── script.js           # Lógica del frontend
├── server.js           # Servidor proxy Node.js
├── package.json        # Dependencias del proyecto
├── README.md           # Documentación del proyecto
├── .gitignore          # Archivos a ignorar por Git
└── GITHUB_SETUP.md     # Esta guía
```

---

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/recetas-app-ica.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Olvidaste hacer commit antes de push
```bash
git add .
git commit -m "Tu mensaje"
git push
```

---

## 📚 Recursos Adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [Guía de GitHub](https://docs.github.com/es)
- [Tutorial interactivo de Git](https://learngitbranching.js.org/)