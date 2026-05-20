# 🍳 Buscador de Recetas por Ingredientes

Aplicación web que busca recetas basándose en los ingredientes que el usuario proporciona, utilizando un workflow de IBM ICA (Intelligent Conversational Agent) para la búsqueda inteligente.

## 📋 Descripción

Esta aplicación permite a los usuarios ingresar una lista de ingredientes disponibles y obtener recetas que pueden prepararse con esos ingredientes. La lógica de búsqueda y el contexto están implementados en una Agentic App de ICA.

## 🚀 Características

- **Interfaz intuitiva**: Diseño moderno y responsivo con gradientes atractivos
- **Búsqueda inteligente**: Conectada al workflow de ICA para resultados contextuales
- **Feedback visual**: Indicadores de carga y mensajes de estado claros
- **Manejo de errores**: Gestión robusta de errores de conexión

## 📁 Estructura del Proyecto

```
Recetas-App-IcaBob/
├── index.html      # Estructura HTML de la aplicación
├── styles.css      # Estilos y diseño visual
├── script.js       # Lógica del cliente (frontend)
├── server.js       # Servidor proxy Node.js (backend)
├── package.json    # Configuración de Node.js
└── README.md       # Este archivo
```

## 🏗️ Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Navegador  │ ───> │ Servidor     │ ───> │  API ICA        │
│  (Cliente)  │      │ Proxy Node.js│      │  (Langflow)     │
│             │ <─── │              │ <─── │                 │
└─────────────┘      └──────────────┘      └─────────────────┘
```

El servidor proxy es necesario para:
- Evitar errores de CORS
- Proteger la API key (no expuesta en el cliente)
- Manejar la autenticación con ICA

## 🔧 Configuración

### Datos del Workflow de ICA

- **Workflow ID**: `e216a392-2d89-45a0-9702-df9152a81827`
- **API Key**: `sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs`
- **Endpoint**: `https://langflow.servicesessentials.ibm.com/api/v1/run/e216a392-2d89-45a0-9702-df9152a81827`

Estos valores están configurados en el archivo [`script.js`](script.js:2-6).

## 🌐 Cómo Usar

### Servidor Node.js con Proxy (Recomendado)

La aplicación incluye un servidor Node.js que actúa como proxy para evitar problemas de CORS:

```bash
# Iniciar el servidor
node server.js
```

O usando npm:
```bash
npm start
```

Luego abre tu navegador en: `http://localhost:3000`

**¿Por qué usar el proxy?**
El servidor de ICA solo acepta peticiones desde `https://servicesessentials.ibm.com`. El proxy local recibe las peticiones del navegador y las reenvía al API de ICA con las credenciales correctas, evitando errores de CORS.

## 💡 Uso de la Aplicación

1. **Ingresa ingredientes**: Escribe los ingredientes disponibles en el campo de texto (ejemplo: "pollo, arroz, tomate, cebolla")
2. **Buscar**: Haz clic en el botón "Buscar Recetas" o presiona `Ctrl+Enter` en el campo de texto
3. **Ver resultados**: La aplicación mostrará las recetas sugeridas por el workflow de ICA en la sección de resultados

## 🔌 Integración con ICA

La aplicación se conecta al workflow de ICA mediante una llamada API POST con el siguiente formato:

```javascript
{
    "output_type": "chat",
    "input_type": "chat",
    "input_value": "[ingredientes del usuario]",
    "session_id": "[UUID único generado]"
}
```

**Headers requeridos:**
```javascript
{
    "Content-Type": "application/json",
    "x-api-key": "sk-BJSh0ch0gU3gXo2ZjvB8D85ZRRlh8wjK4qm8u5_QKQs"
}
```

El workflow procesa la solicitud y devuelve recetas relevantes basadas en los ingredientes proporcionados.

## 🎨 Características de Diseño

- **Gradiente moderno**: Colores púrpura y azul para un aspecto profesional
- **Responsivo**: Se adapta a diferentes tamaños de pantalla
- **Animaciones suaves**: Transiciones y efectos hover para mejor UX
- **Estados visuales**: Indicadores de carga y mensajes de error/éxito claros

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con gradientes y animaciones
- **JavaScript (ES6+)**: Lógica de aplicación y llamadas API
- **Fetch API**: Para comunicación con el workflow de ICA

## 📝 Notas Técnicas

- La aplicación genera un UUID único para cada solicitud al workflow
- Maneja errores de red y muestra mensajes informativos al usuario
- El campo de ingredientes acepta texto libre, separado por comas
- Los resultados se muestran en formato de texto enriquecido

## 🔒 Seguridad

**Nota**: La API key está incluida en el código del lado del cliente para propósitos de demostración. En un entorno de producción, se recomienda:
- Usar un backend proxy para ocultar las credenciales
- Implementar autenticación de usuarios
- Rotar las API keys regularmente

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS ("Failed to fetch" o "Access-Control-Allow-Origin"), esto significa que el servidor de ICA no permite peticiones directas desde el navegador.

**Soluciones:**
1. **Usar un servidor proxy**: Crear un backend intermedio que haga las peticiones al API de ICA
2. **Extensión de navegador**: Instalar una extensión como "CORS Unblock" (solo para desarrollo)
3. **Configuración del servidor**: Contactar al administrador del workflow para habilitar CORS

### Sin Respuesta del API
Verifica que:
- La API key sea válida (`4546ef2810f844e3a46e56b3b873deef`)
- El workflow ID sea correcto (`e216a392-2d89-45a0-9702-df9152a81827`)
- Tengas conexión a internet
- El servicio de ICA esté disponible en `https://langflow.servicesessentials.ibm.com`
- Revisa la consola del navegador (F12) para ver logs detallados

### Puerto en Uso
Si el puerto 8000 u 8080 ya está en uso, prueba con otro puerto:
```bash
python3 -m http.server 3000
# Luego abre: http://localhost:3000
```

## 📄 Licencia

Este proyecto es una demostración de integración con IBM ICA.

---

**Powered by IBM ICA Agentic Workflow** 🤖