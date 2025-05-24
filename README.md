# Rick & Morty Character Comparison

Una aplicación web moderna para explorar y comparar personajes del universo de Rick and Morty. Permite seleccionar dos personajes y analizar los episodios donde aparecen, mostrando episodios exclusivos de cada uno y episodios compartidos.

## 🚀 Funcionalidades Principales

- **Listado Paginado de Personajes**: Dos secciones independientes para seleccionar "Character #1" y "Character #2"
- **Búsqueda de Personajes**: Barra de búsqueda que permite filtrar por nombre, especie o status
- **Cards de Personajes Interactivas**: Cards con imagen, status (Alive/Dead/Unknown), especie y tipo
- **Comparación de Episodios**: Análisis en tres secciones:
  - Episodios exclusivos del Character #1
  - Episodios compartidos entre ambos personajes
  - Episodios exclusivos del Character #2
- **Interfaz Responsive**: Diseño adaptativo para móviles y desktop
- **Estados de Carga**: Loading spinner temático y manejo de errores
- **Validaciones**: Las secciones de episodios solo aparecen al seleccionar ambos personajes
- **Reset Functionality**: Botón para limpiar la selección actual

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **API**: Rick and Morty API (https://rickandmortyapi.com/)

## 📋 Instalación, Configuración y Scripts

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd challenge-conexa

# Instalar dependencias
npm install
```

### Scripts Disponibles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run test         # Tests unitarios
npm run test:watch   # Tests en modo watch
npm run test:coverage # Coverage de tests
```

### Configuración

1. Ejecutar en modo desarrollo:
```bash
npm run dev
```

2. Abrir en el navegador:
```
http://localhost:3000
```

## 🧪 Testing y Coverage

### Ejecutar Tests
```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage
```

### Cobertura de Tests
Los tests incluyen:
- Componentes principales (CharacterCard, EpisodeList, CharacterList)
- Custom hooks (useEpisodeComparison)
- Funciones utilitarias (extractEpisodeIds)
- Servicios de API
- Casos edge y validaciones de usuario
- Interacciones y estados de carga

## 👥 Contribución

Este proyecto fue desarrollado como parte del desafío técnico de Conexa. El código implementa una arquitectura modular con TypeScript, componentes reutilizables, custom hooks para la lógica de comparación, y una suite completa de tests unitarios.