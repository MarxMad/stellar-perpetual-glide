# 🔧 Vercel Troubleshooting Guide

## 🚨 Problema: Push no se refleja en Vercel

### ✅ **Pasos para Verificar:**

#### 1. **Verificar Conexión del Repositorio**
```bash
# Verificar que el push fue exitoso
git log --oneline -3

# Verificar que está en GitHub
# Ve a: https://github.com/MarxMad/stellar-perpetual-glide
```

#### 2. **Verificar Configuración en Vercel Dashboard**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Busca tu proyecto: `stellar-perpetual-glide`
3. Verifica que esté conectado al repositorio correcto
4. Revisa la configuración de build

#### 3. **Configuración Correcta en Vercel:**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 4. **Variables de Entorno Necesarias:**
```bash
NODE_ENV=production
PUBLIC_STELLAR_NETWORK=public
PUBLIC_REFLECTOR_CONTRACT_ID_PUBLIC=CBNGTWIVRCD4FOJ24FGAKI6I5SDAXI7A4GWKSQS7E6UYSR4E4OHRI2JX
PUBLIC_WEBHOOK_BASE_URL=https://tu-app.vercel.app
```

### 🔄 **Soluciones:**

#### **Opción 1: Re-deploy Manual**
1. Ve a Vercel Dashboard
2. Selecciona tu proyecto
3. Ve a la pestaña "Deployments"
4. Haz click en "Redeploy" en el último deployment

#### **Opción 2: Re-conectar Repositorio**
1. Ve a Project Settings
2. Ve a "Git"
3. Desconecta el repositorio
4. Vuelve a conectar con GitHub
5. Selecciona el repositorio correcto

#### **Opción 3: Crear Nuevo Proyecto**
1. En Vercel Dashboard, haz click en "New Project"
2. Importa desde GitHub
3. Selecciona `MarxMad/stellar-perpetual-glide`
4. Configura las variables de entorno
5. Deploy

### 🛠️ **Verificar Build Localmente:**
```bash
# Instalar dependencias
npm install

# Build local
npm run build

# Verificar que se creó la carpeta dist
ls -la dist/
```

### 📋 **Checklist de Verificación:**
- [ ] Push exitoso a GitHub
- [ ] Repositorio conectado en Vercel
- [ ] Framework detectado como Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Variables de entorno configuradas
- [ ] No hay errores en el build

### 🚨 **Errores Comunes:**

#### **Error: "Build Command not found"**
```bash
# Solución: Verificar package.json
npm run build
```

#### **Error: "Framework not detected"**
```bash
# Solución: Configurar manualmente en Vercel
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

#### **Error: "Environment variables missing"**
```bash
# Solución: Agregar en Vercel Dashboard
Settings > Environment Variables
```

### 📞 **Soporte:**
- **Vercel Docs**: https://vercel.com/docs
- **Vite + Vercel**: https://vercel.com/guides/deploying-vitejs-to-vercel
- **GitHub**: https://github.com/MarxMad/stellar-perpetual-glide

### 🎯 **Próximos Pasos:**
1. Verificar que el deployment se complete
2. Probar el webhook endpoint
3. Configurar variables de entorno
4. Crear suscripción en Reflector Network
