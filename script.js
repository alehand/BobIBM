// Configuración del API - Usando proxy local para evitar CORS
const API_CONFIG = {
    // Endpoint del proxy local que se conecta al workflow de ICA
    endpoint: '/api/search-recipes'
};

// Elementos del DOM
const ingredientsInput = document.getElementById('ingredients');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('results');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');

// Función para generar UUID (similar a crypto.randomUUID())
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Función para mostrar el estado de carga
function setLoading(isLoading) {
    searchBtn.disabled = isLoading;
    if (isLoading) {
        btnText.style.display = 'none';
        loader.style.display = 'block';
    } else {
        btnText.style.display = 'block';
        loader.style.display = 'none';
    }
}

// Función para obtener icono según el nombre de la receta
function getRecipeIcon(recipeName) {
    const name = recipeName.toLowerCase();
    
    if (name.includes('pasta') || name.includes('carbonara') || name.includes('spaghetti')) return '🍝';
    if (name.includes('arroz') || name.includes('rice')) return '🍚';
    if (name.includes('ensalada') || name.includes('salad')) return '🥗';
    if (name.includes('pollo') || name.includes('chicken')) return '🍗';
    if (name.includes('carne') || name.includes('meat') || name.includes('beef')) return '🥩';
    if (name.includes('pescado') || name.includes('fish')) return '🐟';
    if (name.includes('tarta') || name.includes('pie') || name.includes('postre') || name.includes('dessert')) return '🥧';
    if (name.includes('sopa') || name.includes('soup')) return '🍲';
    if (name.includes('pizza')) return '🍕';
    if (name.includes('hamburguesa') || name.includes('burger')) return '🍔';
    if (name.includes('taco') || name.includes('burrito')) return '🌮';
    if (name.includes('sushi')) return '🍣';
    if (name.includes('pan') || name.includes('bread')) return '🍞';
    if (name.includes('salsa') || name.includes('sauce')) return '🥫';
    
    return '🍽️'; // Icono por defecto
}

// Función para parsear recetas del texto
function parseRecipes(text) {
    const recipes = [];
    
    // Buscar patrones de recetas numeradas (1. Nombre de Receta)
    const recipePattern = /(\d+)\.\s+([^\n]+)/g;
    let match;
    let currentRecipe = null;
    
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detectar inicio de receta
        const recipeMatch = line.match(/^(\d+)\.\s+(.+)/);
        if (recipeMatch) {
            // Guardar receta anterior si existe
            if (currentRecipe) {
                recipes.push(currentRecipe);
            }
            
            // Iniciar nueva receta
            currentRecipe = {
                number: recipeMatch[1],
                name: recipeMatch[2].trim(),
                content: []
            };
        } else if (currentRecipe && line) {
            // Agregar contenido a la receta actual
            currentRecipe.content.push(line);
        }
    }
    
    // Agregar última receta
    if (currentRecipe) {
        recipes.push(currentRecipe);
    }
    
    return recipes;
}

// Función para crear acordeón de receta
function createRecipeAccordion(recipe, index) {
    const accordion = document.createElement('div');
    accordion.className = 'recipe-accordion';
    
    const header = document.createElement('div');
    header.className = 'recipe-header';
    header.innerHTML = `
        <div class="recipe-icon">${getRecipeIcon(recipe.name)}</div>
        <div class="recipe-title-container">
            <div class="recipe-title">${recipe.name}</div>
            <div class="recipe-meta">Haz clic para ver detalles</div>
        </div>
        <div class="recipe-chevron">▼</div>
    `;
    
    const content = document.createElement('div');
    content.className = 'recipe-content';
    
    const body = document.createElement('div');
    body.className = 'recipe-body';
    body.innerHTML = recipe.content.join('<br>').replace(/\n/g, '<br>');
    
    content.appendChild(body);
    accordion.appendChild(header);
    accordion.appendChild(content);
    
    // Toggle al hacer clic
    header.addEventListener('click', () => {
        const isActive = header.classList.contains('active');
        
        // Cerrar todos los demás acordeones
        document.querySelectorAll('.recipe-header').forEach(h => {
            h.classList.remove('active');
        });
        document.querySelectorAll('.recipe-content').forEach(c => {
            c.classList.remove('active');
        });
        
        // Toggle el actual
        if (!isActive) {
            header.classList.add('active');
            content.classList.add('active');
        }
    });
    
    return accordion;
}

// Función para mostrar resultados
function displayResults(content, isError = false) {
    resultsContainer.innerHTML = '';
    
    if (isError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = content;
        resultsContainer.appendChild(errorDiv);
        return;
    }
    
    // Intentar parsear recetas
    const recipes = parseRecipes(content);
    
    if (recipes.length > 0) {
        // Mostrar recetas en acordeón
        recipes.forEach((recipe, index) => {
            const accordion = createRecipeAccordion(recipe, index);
            resultsContainer.appendChild(accordion);
        });
    } else {
        // Mostrar contenido simple
        const resultDiv = document.createElement('div');
        resultDiv.className = 'simple-result';
        resultDiv.innerHTML = content.replace(/\n/g, '<br>');
        resultsContainer.appendChild(resultDiv);
    }
}

// Función para mostrar mensaje vacío
function displayEmptyState() {
    resultsContainer.innerHTML = `
        <div class="empty-state">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="#e0e0e0" stroke-width="2"/>
                <path d="M35 50 L45 60 L65 40" stroke="#e0e0e0" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <p>Ingresa ingredientes y presiona "Buscar Recetas" para comenzar</p>
        </div>
    `;
}

// Función principal para buscar recetas
async function searchRecipes() {
    const ingredients = ingredientsInput.value.trim();
    
    // Validar que se hayan ingresado ingredientes
    if (!ingredients) {
        displayResults('Por favor, ingresa al menos un ingrediente.', true);
        return;
    }
    
    setLoading(true);
    
    try {
        console.log('Enviando ingredientes al servidor proxy...');
        console.log('Ingredientes:', ingredients);
        
        // Enviar al proxy local que manejará la conexión con ICA
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients })
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}\n${errorText}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        console.log('Respuesta recibida:', data);
        
        // Procesar y mostrar la respuesta
        if (data && data.outputs && data.outputs.length > 0) {
            // Extraer el mensaje de la respuesta de ICA
            const output = data.outputs[0];
            
            if (output.outputs && output.outputs.length > 0) {
                // Recorrer todos los outputs para encontrar el mensaje
                for (let i = 0; i < output.outputs.length; i++) {
                    const item = output.outputs[i];
                    
                    // Buscar en results.message
                    if (item.results && item.results.message) {
                        let messageText = item.results.message.text || item.results.message;
                        
                        if (typeof messageText === 'string' && messageText.trim()) {
                            // Buscar y eliminar la sección de tool trace
                            const toolTraceIndex = messageText.toLowerCase().indexOf('tool trace');
                            if (toolTraceIndex !== -1) {
                                messageText = messageText.substring(0, toolTraceIndex).trim();
                            }
                            
                            // Limpiar texto técnico
                            messageText = messageText
                                .replace(/\(Salida completa de la Tool\)/gi, '')
                                .replace(/\*\*Tool trace\*\*/gi, '')
                                .trim();
                            
                            if (messageText) {
                                displayResults(messageText);
                                return;
                            }
                        }
                    }
                    
                    // Buscar en artifacts si existe
                    if (item.artifacts && Array.isArray(item.artifacts)) {
                        for (const artifact of item.artifacts) {
                            if (artifact.data && typeof artifact.data === 'string') {
                                displayResults(artifact.data);
                                return;
                            }
                        }
                    }
                }
                
                // Si no se encontró mensaje, mostrar estructura completa para debug
                console.warn('No se pudo extraer el mensaje. Estructura:', output.outputs);
                displayResults('Respuesta recibida pero no se pudo extraer el mensaje. Revisa la consola para más detalles.');
            } else {
                displayResults('No se encontraron recetas con esos ingredientes.');
            }
        } else if (data && data.output_value) {
            displayResults(data.output_value);
        } else if (data && data.message) {
            displayResults(data.message);
        } else {
            console.warn('Estructura de respuesta desconocida:', data);
            displayResults('No se recibió una respuesta válida del servidor.');
        }
        
    } catch (error) {
        console.error('Error completo:', error);
        
        let errorMessage = 'Error al conectar con el servicio de recetas:\n\n';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage += '❌ No se pudo conectar con el servidor.\n\n';
            errorMessage += 'Posibles causas:\n';
            errorMessage += '• Problema de CORS (el servidor no permite peticiones desde este origen)\n';
            errorMessage += '• El servidor no está disponible\n';
            errorMessage += '• Problema de red o firewall\n\n';
            errorMessage += 'Verifica la consola del navegador para más detalles.';
        } else {
            errorMessage += error.message;
        }
        
        displayResults(errorMessage, true);
    } finally {
        setLoading(false);
    }
}

// Event Listeners
searchBtn.addEventListener('click', searchRecipes);

// Permitir buscar con Enter en el textarea
ingredientsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        searchRecipes();
    }
});

// Mensaje inicial
console.log('Aplicación de búsqueda de recetas cargada correctamente');
console.log('Presiona Ctrl+Enter en el campo de ingredientes para buscar rápidamente');

// Made with Bob
