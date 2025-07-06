# 🚀 Guía de Despliegue en GitHub Pages

## Pasos para Desplegar tu Landing Page

### 1. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Crea un nuevo repositorio público llamado `apelolito`
3. **NO** inicialices con README (ya tenemos uno)

### 2. Subir Archivos al Repositorio

```bash
# Inicializar Git en tu carpeta local
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "🎉 Inicial: Landing page completa de Apelolito"

# Conectar con tu repositorio remoto
git remote add origin https://github.com/TU-USUARIO/apelolito.git

# Subir archivos
git push -u origin main
```

### 3. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. Scroll hacia abajo hasta **Pages**
4. En **Source**, selecciona **Deploy from a branch**
5. En **Branch**, selecciona **main** y **/ (root)**
6. Click **Save**

### 4. Personalizar Antes del Despliegue

#### Actualizar Números de WhatsApp
Reemplaza `1234567890` con tu número real:

**En `index.html`:**
```html
<!-- Línea 307 -->
<a href="https://wa.me/TU-NUMERO?text=..." 
```

**En `js/script.js`:**
```javascript
// Función claimPrize()
window.open(`https://wa.me/TU-NUMERO?text=${message}`, '_blank');

// Función initContactForm()
window.open(`https://wa.me/TU-NUMERO?text=${message}`, '_blank');
```

#### Actualizar Información de Contacto
**En `index.html`:**
- Línea 218: Teléfono en la sección de contacto
- Línea 222: Email
- Línea 226: Ubicación

#### Actualizar URLs en `_config.yml`
```yaml
url: "https://TU-USUARIO.github.io"
baseurl: "/apelolito"
github_username: TU-USUARIO
```

### 5. Dominios Personalizados (Opcional)

Si tienes un dominio propio:

1. Crea un archivo `CNAME` en la raíz del proyecto
2. Escribe tu dominio: `www.apelolito.com`
3. Configura los DNS de tu dominio apuntando a GitHub Pages

### 6. Verificar el Despliegue

1. GitHub Pages tarda 5-10 minutos en procesar
2. Tu sitio estará disponible en: `https://TU-USUARIO.github.io/apelolito`
3. Verifica que todas las funcionalidades trabajen correctamente

### 7. Actualizaciones Futuras

Para actualizar tu sitio:
```bash
# Hacer cambios en los archivos
git add .
git commit -m "📝 Actualización: descripción del cambio"
git push origin main
```

Los cambios se reflejarán automáticamente en 5-10 minutos.

## 🔧 Configuraciones Adicionales

### Google Analytics (Opcional)
1. Descomenta la línea en `_config.yml`
2. Agrega tu código de tracking
3. Actualiza el archivo `index.html` con el script de GA

### Verificación de Google Search Console
1. Obtén tu código de verificación
2. Descomenta y actualiza la línea en `_config.yml`
3. O agrega el meta tag en `index.html`

### Optimización de Velocidad
- Las imágenes ya están optimizadas
- CSS y JS están minificados
- Lazy loading implementado
- Fonts optimizados con preconnect

## 📊 Métricas y Monitoreo

Para monitorear el rendimiento:
1. Google Analytics para métricas de usuario
2. Google Search Console para SEO
3. PageSpeed Insights para velocidad
4. Google Lighthouse para auditoría completa

## 🛠️ Troubleshooting

### Problemas Comunes

**"El sitio no se ve bien"**
- Verificar que los archivos CSS y JS se carguen correctamente
- Revisar la consola del navegador por errores

**"El juego no funciona"**
- Verificar que JavaScript esté habilitado
- Comprobar errores en la consola del navegador

**"WhatsApp no funciona"**
- Verificar que el número esté en formato internacional
- Probar el enlace manualmente

**"El sitio no se actualiza"**
- Limpiar caché del navegador
- Esperar 10 minutos para propagación de GitHub Pages

## 📞 Soporte

Si tienes problemas con el despliegue:
1. Revisa la [documentación oficial de GitHub Pages](https://pages.github.com/)
2. Verifica que todos los archivos estén en el repositorio
3. Comprueba que no haya errores en la consola del navegador

---

**¡Tu landing page está lista para conquistar el mundo de los eventos infantiles!** 🎈✨ 