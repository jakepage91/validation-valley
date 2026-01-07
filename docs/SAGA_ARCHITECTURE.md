# LEGACY'S END: Desmantelando el Monolito
## Arquitectura Completa de la Saga

---

## 🎯 Objetivo General

Guiar a **Alarion** (El Acólito/Novato) a través de un viaje de transformación del código legacy a Clean Code, aplicando principios de arquitectura frontend moderna. Alarion nace en el caos de las malas prácticas (Monolito Acoplado) y debe dominar los Protocolos del Nuevo Orden para unirse a la "Élite del Clean Code".

---

## 🏛️ Hub Central: La Sala de los Fragmentos

**Descripción**: El punto de inicio y regreso de Alarion. Aquí selecciona sus próximas misiones y ve su progreso general.

**Funcionalidad**:
- Selección de quests disponibles
- Visualización de progreso (badges, métricas)
- Árbol de dependencias de quests
- Acceso a quests bloqueadas (muestra prerequisites)

---



## 🗺️ Árbol de Progresión (Quest Dependency Tree)

```
Hall of Fragments (Hub)
    ↓
The Aura of Sovereignty (C1)
    ↓
    ├─→ The Chromatic Loom (C2)
    │
    └─→ The Orb of Inquiry (C3)
            ↓
            ├─→ The Flowing Heartstone (C4)
            │       ↓                      
            │       └─→ The Crimson Altar (C7)
            │                                     
            ├─→ The Watcher's Bastion (C5)
            │                                     
            └─→ The Mirror of Veracity (C6)       
                    ↓                             
                    └─→ The Scroll of Tongues (C8)
```

**Reglas de Desbloqueo**:
- **C1** se desbloquea al inicio
- **C2** y **C3** se desbloquean al completar **C1**
- **C4**, **C5** y **C6** se desbloquean al completar **C3**
- **C7** se desbloquea al completar **C4**
- **C8** se desbloquea al completar **C6**

---

## 📚 Capítulos de la Saga

### Capítulo 1: The Aura of Sovereignty
**Subtítulo**: La Fundación
**Duración**: 10-15 min
**Niveles**: 2-3 niveles cortos
**Dificultad**: Beginner
**Color**: Indigo (#6366f1)

**Objetivo de Alarion**: Ganar Encapsulación y Aislamiento del entorno global. Es su primera armadura.

**Problema Legacy**: El componente está acoplado al DOM global y a scripts externos.

**Conceptos Clave**:
- Web Components
- Shadow DOM
- Aislamiento de estilos y scripts

**Recompensa**: 
- Badge: "Isolated Component"
- Habilidad: Encapsulación y Aislamiento
- Descripción: Componente aislado, sin conflictos CSS/JS globales

**Narrativa**: Alarion aprende a crear su primera "túnica" de protección, aislándose del caos del DOM global.

---

### Capítulo 2: The Chromatic Loom
**Subtítulo**: El Estilo
**Duración**: 20-30 min
**Niveles**: 3-4 niveles
**Dificultad**: Intermediate
**Color**: Purple (#8b5cf6)

**Objetivo de Alarion**: Lograr Adaptación Visual a cualquier tema o marca.

**Problema Legacy**: Estilos hardcodeados o componentes que no pueden cambiar de tema.

**Conceptos Clave**:
- Design Tokens
- CSS Custom Properties
- Tematización programática

**Recompensa**:
- Badge: "Visually Agnostic"
- Habilidad: Adaptación Visual
- Descripción: Componente visualmente agnóstico y adaptable

**Narrativa**: Alarion descubre los "tokens" místicos que le permiten cambiar su apariencia sin alterar su esencia.

---

### Capítulo 3: The Orb of Inquiry
**Subtítulo**: La Lógica IoC
**Duración**: 40-45 min
**Niveles**: 5 niveles (Hall of Definition, Temple of Inversion, Chamber of Integration, Training Room, Liberated Battlefield)
**Dificultad**: Intermediate
**Color**: Green (#10b981)

**Objetivo de Alarion**: Romper el acoplamiento de servicios y lograr la independencia lógica.

**Problema Legacy**: Dependencia directa de fetch o variables globales (window.service).

**Conceptos Clave**:
- Dependency Inversion Principle (DIP)
- Inversión de Control (IoC)
- Interfaces de Servicio (Contratos)
- Context API (Provider/Consumer)
- Mocking & Testing
- Hot Switch de servicios

**Recompensa**:
- Badge: "Backend Agnostic"
- Habilidad: Independencia Lógica
- Descripción: Componente 100% agnóstico al backend y testeable

**Narrativa**: Alarion domina el arte de la inyección, aprendiendo a definir contratos, proveer servicios, consumirlos de forma segura y testearlos en aislamiento. Culmina con el "Hot Switch" - cambiar de servicio en vivo sin romper nada.

---

### Capítulo 4: The Flowing Heartstone
**Subtítulo**: El Caos del Estado
**Duración**: 30-40 min
**Niveles**: 4-5 niveles
**Dificultad**: Advanced
**Color**: Amber (#f59e0b)

**Objetivo de Alarion**: Conquistar el Caos del Estado Global y lograr la previsibilidad de los datos.

**Problema Legacy**: Prop drilling, mutación de estado global impredecible, estado no reactivo.

**Conceptos Clave**:
- Patrones Reactivos (Signals, Observable Stores)
- Context API (para inyectar Stores)
- Flujo de datos unidireccional

**Recompensa**:
- Badge: "State Master"
- Habilidad: Previsibilidad del Estado
- Descripción: Componente reactivo, predecible y sin prop drilling

**Narrativa**: Alarion enfrenta el "Raid" más difícil - domesticar el estado caótico que fluye sin control por la aplicación.

---

### Capítulo 5: The Watcher's Bastion
**Subtítulo**: La Identidad Perimetral
**Duración**: 30-40 min
**Niveles**: 4-5 niveles
**Dificultad**: Advanced
**Color**: Red (#ef4444)

**Objetivo de Alarion**: Centralizar la Lógica de Seguridad y lograr la Identidad Perimetral.

**Problema Legacy**: Lógica de autenticación dispersa, comprobaciones isLoggedIn() repetidas, vulnerabilidades de redirección.

**Conceptos Clave**:
- Auth Guards
- Contexto de Usuario
- Gestión centralizada de sesión
- Protección de rutas

**Recompensa**:
- Badge: "Security Guardian"
- Habilidad: Seguridad Centralizada
- Descripción: Aplicación segura, identidad de usuario accesible y reactiva

**Narrativa**: Alarion se convierte en guardián de la "Puerta de Identidad", aprendiendo a proteger el reino con autenticación centralizada.

---

### Capítulo 6: The Mirror of Veracity
**Subtítulo**: La Verdad Verificada
**Duración**: 30-40 min
**Niveles**: 3-4 niveles
**Dificultad**: Advanced
**Color**: Sky Blue (#0ea5e9)

**Objetivo de Alarion**: Dominar el arte de la Verificación y el Testing.

**Problema Legacy**: Código frágil, bugs de regresión, falta de confianza en los cambios.

**Conceptos Clave**:
- Testing Pyramid
- Unit Testing
- Integration Testing
- Mocking
- TDD

**Recompensa**:
- Badge: "Truth Seeker"
- Habilidad: Verificación Automatizada
- Descripción: Componente blindado contra regresiones

**Narrativa**: Alarion mira en el Espejo de la Verdad, aprendiendo a escribir pruebas que revelan la verdadera naturaleza de su código.

---

### Capítulo 7: The Crimson Altar
**Subtítulo**: El Ojo que Todo lo Ve
**Duración**: 35-45 min
**Niveles**: 3-4 niveles
**Dificultad**: Advanced
**Color**: Violet (#7c3aed)

**Objetivo de Alarion**: Transformar el caos de los errores en inteligencia.

**Problema Legacy**: Errores no controlados que rompen la app, fallos silenciosos.

**Conceptos Clave**:
- Centralized Error Handling
- Logging
- Observability Patterns
- Boundary Error Components

**Recompensa**:
- Badge: "Chaos Warden"
- Habilidad: Monitoreo Centralizado
- Descripción: Aplicación resiliente con observabilidad total

**Narrativa**: Alarion aprende a canalizar el caos en el Altar Carmesí, convirtiendo los errores en señales claras para la mejora.

---

### Capítulo 8: The Scroll of Tongues
**Subtítulo**: La Voz Universal
**Duración**: 25-35 min
**Niveles**: 2-3 niveles
**Dificultad**: Intermediate
**Color**: Pink (#db2777)

**Objetivo de Alarion**: Desbloquear la Globalización Total.

**Problema Legacy**: Textos hardcodeados, formatos de fecha/número incorrectos por región.

**Conceptos Clave**:
- i18n Context
- Locale Management
- Contextual Formatting
- String Management

**Recompensa**:
- Badge: "Polyglot Master"
- Habilidad: Globalización Total
- Descripción: Componente accesible en cualquier idioma y cultura

**Narrativa**: Alarion descifra el Pergamino de las Lenguas, permitiendo que su código hable con todas las voces del mundo.

---



## 🎮 Elementos del Motor de Juego

### Spritesheet del Personaje
- **Alarion**: Evoluciona visualmente con cada capítulo completado
- Estados: Idle, Walking (4 direcciones), Interacting
- Evolución: Gana armadura, armas, y efectos visuales con cada badge

### Fondos de Nivel
- Pixel art, vista cenital
- Resolución: 256x256 píxeles
- Temáticos a cada capítulo (ej: Tunic = Fortaleza, Token = Paleta de colores, etc.)

### NPCs (Mentores/Guardias)
- Un NPC por nivel
- Función: Explicar el problema legacy y guiar hacia la solución
- Diálogo: Narrativo + técnico

### Triggers/Recompensas
- Un objeto interactivo por nivel
- Simboliza la "habilidad" o "ley" aprendida
- Ejemplos: Scroll, Codex, Crystal, Shield

### HUD (Heads-Up Display)
- Métricas de Mantenibilidad y Portabilidad (0-100%)
- Nivel actual / Total de niveles
- Badges obtenidos
- Quest actual

---

## 🔐 Sistema de Progreso

### Persistencia
- **localStorage**: Guarda progreso, badges, quests completadas
- **Formato**: JSON con estructura versionada

### Tracking
```javascript
{
  completedQuests: ['the-aura-of-sovereignty'],
  completedChapters: ['hall-of-fragments'],
  currentQuest: 'the-chromatic-loom',
  currentChapter: 'fortress-of-design',
  unlockedQuests: ['the-aura-of-sovereignty', 'the-chromatic-loom'],
  achievements: ['Isolated Component'],
  stats: {
    totalPlayTime: 3600, // seconds
    questsCompleted: 1,
    chaptersCompleted: 1
  }
}
```



## 🚀 Roadmap de Implementación

### ✅ Fase 1: Infraestructura (Completada)
- Quest Registry
- Progress Service
- Quest Controller

### ✅ Fase 2: Migración (Completada)
- Integrar juego actual con quest system
- Adaptar LEVEL_DATA al nuevo formato

### ✅ Fase 3: Hub UI (Completada)
- Componente quest-hub
- Visualización de quests disponibles y bloqueadas
- Quest cards con progreso

### 🔄 Fase 4: Contenido (En Progreso)
- [x] The Aura of Sovereignty (Quest 1)
- [x] The Orb of Inquiry (Quest 3)
- [ ] The Chromatic Loom (Quest 2)
- [ ] State Management (Quest 4)
- [ ] The Gate of Identity (Quest 5)
- [ ] The Mirror of Veracity (Quest 6)
- [ ] The Crimson Altar (Quest 7)
- [ ] The Scroll of Tongues (Quest 8)

### ✅ Fase 6: Desacoplamiento (Completada)
- Refactorización de `GameView` para eliminar dependencia de `app`.
- Implementación de `IGameContext`.
- Introducción del Command Bus.

### ✅ Fase 7: Extracción de Lógica de Dominio (Completada)
- Creación de Use Cases (`EvaluateChapterTransition`, `ProcessGameZoneInteraction`).
- Limpieza de Controladores.


### 🎨 Fase 5: Polish
- Animaciones de transición
- Sistema de achievements
- Estadísticas y leaderboards

---

## 💡 Ideas Futuras

- **Multiplayer**: Compartir progreso con amigos
- **Custom Quests**: Contenido creado por la comunidad
- **Difficulty Modes**: Easy/Normal/Hard
- **New Game+**: Replay con desafíos más difíciles
- **Speed Run Mode**: Competir por tiempo
- **Achievement System**: Badges especiales por logros ocultos
