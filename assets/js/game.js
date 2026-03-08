/* ===========================================
   REQQUEST 3D: OFFICE EDITION - GAME LOGIC
   =========================================== */

// --- STARTUP FUNCTIONS ---
function startGame() {
    document.getElementById('intro-screen').classList.add('hidden');
    // Audio context could start here if added later
    
    // 🎯 ANALYTICS: Track game start
    trackGameStart();
}

// 🎯 ANALYTICS FUNCTIONS
function trackGameStart() {
    if (typeof gtag === 'function') {
        gtag('event', 'game_start', {
            event_category: 'gamification',
            game_name: 'ReqQuest 3D',
            value: 10
        });
        console.log('[Analytics] Game start tracked');
    }
}

function trackChallengeCompleted(npcId, npcName, isCorrect) {
    if (typeof gtag === 'function') {
        gtag('event', 'challenge_solved', {
            event_category: 'gamification',
            challenge_id: npcId,
            challenge_name: npcName,
            success: isCorrect,
            value: isCorrect ? 5 : 1
        });
        console.log('[Analytics] Challenge tracked:', npcId, isCorrect);
    }
}

function trackLevelProgress(completedCount, totalChallenges) {
    if (typeof gtag === 'function') {
        const progress = Math.round((completedCount / totalChallenges) * 100);
        gtag('event', 'level_progress', {
            event_category: 'gamification',
            challenges_completed: completedCount,
            total_challenges: totalChallenges,
            progress_percent: progress,
            value: 3
        });
        console.log('[Analytics] Level progress tracked:', progress + '%');
    }
}

function trackGameComplete(finalRep, finalBudget, totalTime) {
    if (typeof gtag === 'function') {
        gtag('event', 'game_complete', {
            event_category: 'gamification',
            final_reputation: finalRep,
            final_budget: finalBudget,
            total_time_minutes: Math.round(totalTime / 60),
            challenges_completed: 13,
            value: 50 // Very high value for game completion
        });
        console.log('[Analytics] Game completion tracked');
    }
}

function trackBossUnlocked() {
    if (typeof gtag === 'function') {
        gtag('event', 'boss_unlocked', {
            event_category: 'gamification',
            challenges_before_boss: 12,
            value: 15
        });
        console.log('[Analytics] Boss unlocked tracked');
    }
}

function trackStakeholderInteraction(npcId, npcName, npcRole) {
    if (typeof gtag === 'function') {
        gtag('event', 'stakeholder_interaction', {
            event_category: 'gamification',
            stakeholder_id: npcId,
            stakeholder_name: npcName,
            stakeholder_role: npcRole,
            value: 2
        });
        console.log('[Analytics] Stakeholder interaction tracked:', npcName);
    }
}

// --- GAME DATA ---
const GAME_DATA = {
    reputation: 100,
    budget: 100,
    completed: [],
    npcs: [
        // --- BLOQUE 1: NATURALEZA DEL SOFTWARE Y STAKEHOLDERS (Top Left: Management) ---
        {
            id: 'ministro', name: 'Ministro', role: 'Stakeholder Político', color: 0xef4444, x: -30, z: -30,
            text: "El software es invisible, así que cambiarlo es fácil y rápido. ¿Verdad?",
            opts: [
                { txt: "Sí, es muy flexible.", correct: false, feed: "❌ Falso. La invisibilidad crea la ilusión de simplicidad, pero la complejidad crece exponencialmente (Brooks).", costR: -15, costB: 0 },
                { txt: "Solo si usamos metodologías ágiles.", correct: false, feed: "❌ Incompleto. La agilidad ayuda, pero no elimina la 'Dificultad Esencial' de la complejidad.", costR: -5, costB: -5 },
                { txt: "No. La invisibilidad oculta la complejidad estructural.", correct: true, feed: "✅ Correcto. Brooks advierte que la invisibilidad es una dificultad esencial que complica la gestión.", costR: 10, costB: 0 }
            ]
        },
        {
            id: 'architect', name: 'Arquitecto', role: 'Líder Técnico', color: 0x64748b, x: -32, z: -18,
            text: "Detectamos un error en un requerimiento base. ¿Lo arreglamos ahora o en producción?",
            opts: [
                { txt: "En producción, para no atrasar el release.", correct: false, feed: "❌ Catastrófico. Corregir en producción cuesta entre 100 y 200 veces más (Economía del Error).", costR: -30, costB: -50 },
                { txt: "Ahora mismo.", correct: true, feed: "✅ Vital. La mayoría de los errores nacen en requerimientos y son más baratos de corregir aquí.", costR: 10, costB: 10 },
                { txt: "Da igual, el costo es el mismo.", correct: false, feed: "❌ Error conceptual grave sobre la economía del software.", costR: -10, costB: 0 }
            ]
        },
        {
            id: 'director', name: 'Director', role: 'Stakeholder Financiero', x: -18, z: -32, color: 0xf59e0b,
            text: "Quiero seguridad máxima tipo Pentágono, pero que el acceso sea instantáneo y sin claves.",
            opts: [
                { txt: "Lo programamos así, no hay problema.", correct: false, feed: "❌ Falso. Ignoras el conflicto inherente entre Seguridad y Usabilidad.", costR: -20, costB: 0 },
                { txt: "Usemos biometría, eso resuelve todo.", correct: false, feed: "❌ Simplista. La biometría introduce nuevos riesgos y costos de hardware. No analiza el fondo.", costR: -5, costB: -20 },
                { txt: "Imposible. Hay tensión entre Seguridad y Usabilidad.", correct: true, feed: "✅ Bien. Identificaste el Triángulo de Tensión. Debemos negociar un balance.", costR: 15, costB: 0 }
            ]
        },

        // --- BLOQUE 2: ELICITACIÓN Y MODELADO (Top Right: Dev & Analysis) ---
        {
            id: 'medico', name: 'Dra. López', role: 'Experta del Dominio', color: 0x22c55e, x: 30, z: -30,
            text: "Para el LEL, ¿cómo definimos 'Paciente Crítico'?",
            opts: [
                { txt: "Alguien que está muy grave.", correct: false, feed: "❌ Muy vago y subjetivo. No sirve para especificar.", costR: -10, costB: 0 },
                { txt: "Objeto Paciente con status='critical'.", correct: false, feed: "❌ Demasiado técnico. El LEL debe usar el lenguaje del usuario (dominio).", costR: -5, costB: 0 },
                { txt: "Ingresado con riesgo vital (Noción) -> Activa protocolo (Impacto).", correct: true, feed: "✅ Perfecto. Estructura LEL correcta: Noción (qué es) e Impacto (qué hace).", costR: 15, costB: 0 }
            ]
        },
        {
            id: 'marketing', name: 'Gte. Marketing', role: 'Usuario Indirecto', x: 32, z: -18, color: 0xec4899,
            text: "Necesitamos la opinión de 10.000 usuarios distribuidos en 5 países. ¿Cómo hacemos?",
            opts: [
                { txt: "Entrevistas individuales para profundidad.", correct: false, feed: "❌ Inviable económicamente y temporalmente para esa escala.", costR: 0, costB: -50 },
                { txt: "Brainstorming masivo.", correct: false, feed: "❌ Caótico e imposible de gestionar con tanta gente.", costR: -10, costB: -10 },
                { txt: "Cuestionarios (Surveys).", correct: true, feed: "✅ Correcto. Es la técnica adecuada para gran alcance geográfico y volumen.", costR: 10, costB: 10 }
            ]
        },
        {
            id: 'scrum_master', name: 'Scrum Master', role: 'Facilitador', x: 18, z: -32, color: 0x8b5cf6,
            text: "¿Cuál es el orden lógico de trazabilidad para especificar una funcionalidad?",
            opts: [
                { txt: "Código -> Test -> Requerimiento.", correct: false, feed: "❌ Al revés. Eso es ingeniería inversa o caos.", costR: -10, costB: 0 },
                { txt: "User Story -> LEL -> Código.", correct: false, feed: "❌ Mezcla conceptos ágiles sin base de vocabulario clara.", costR: -5, costB: 0 },
                { txt: "LEL -> Kernel -> Escenario -> Caso de Uso.", correct: true, feed: "✅ Excelente. Del vocabulario a la oración, a la narración y finalmente a la formalización.", costR: 15, costB: 0 }
            ]
        },

        // --- BLOQUE 3: ESPECIFICACIÓN Y CALIDAD (Bottom Left: Ops & Support) ---
        {
            id: 'analista', name: 'Analista Sr.', role: 'Mentor', x: -30, z: 30, color: 0xa855f7,
            text: "Llegó este requerimiento: 'El sistema debe ser amigable e intuitivo'. ¿Dictamen?",
            opts: [
                { txt: "Aprobado. Es importante la usabilidad.", correct: false, feed: "❌ Error. 'Amigable' es subjetivo y no verificable. Viola IEEE 830.", costR: -10, costB: 0 },
                { txt: "Lo ponemos como 'Deseo' del cliente.", correct: false, feed: "❌ Débil. Debemos transformarlo en un requerimiento real.", costR: -5, costB: 0 },
                { txt: "Rechazado. Reformular: 'Usuario logra tarea en <3 min'.", correct: true, feed: "✅ Correcto. Debe ser Verificable y medible objetivamente.", costR: 10, costB: 0 }
            ]
        },
        {
            id: 'qa_lead', name: 'Líder QA', role: 'Calidad', x: -32, z: 18, color: 0xd946ef,
            text: "El software no falla técnicamente, pero el usuario no entiende cómo usarlo. ¿Qué falló?",
            opts: [
                { txt: "La Verificación.", correct: false, feed: "❌ No. La verificación (¿lo hicimos correctamente?) pasó bien.", costR: -10, costB: 0 },
                { txt: "Es culpa del usuario.", correct: false, feed: "❌ Actitud incorrecta. El sistema debe adaptarse al usuario.", costR: -15, costB: 0 },
                { txt: "La Validación.", correct: true, feed: "✅ Exacto. Validación: ¿Hicimos el producto correcto para el usuario?", costR: 15, costB: 0 }
            ]
        },
        {
            id: 'compliance', name: 'Oficial Normativo', role: 'Gestión', x: -18, z: 32, color: 0x475569,
            text: "Cambió la normativa. El Requerimiento R-105 ya no sirve, necesitamos uno nuevo diferente.",
            opts: [
                { txt: "Editamos el texto del R-105.", correct: false, feed: "❌ Mala práctica. Se pierde la historia y trazabilidad del cambio.", costR: -10, costB: 0 },
                { txt: "Lo hacemos 'por izquierda' para ir rápido.", correct: false, feed: "❌ Inaceptable. Genera deuda técnica y legal.", costR: -20, costB: 0 },
                { txt: "Descartar R-105, crear nuevo ID y trazar.", correct: true, feed: "✅ Correcto. Mantiene la integridad de la Línea Base y la historia.", costR: 10, costB: 0 }
            ]
        },

        // --- BLOQUE 4: GOALS (GORE) Y MÉTRICAS (Bottom Right: Medical/User) ---
        {
            id: 'ba', name: 'Business Analyst', role: 'Estratega', x: 30, z: 30, color: 0xe11d48,
            text: "Objetivo del CEO: 'Evitar que dos clientes compren el mismo asiento al mismo tiempo'.",
            opts: [
                { txt: "Es un Goal de Logro (Achievement).", correct: false, feed: "❌ No. No busca alcanzar un estado nuevo, sino mantener una restricción.", costR: -5, costB: 0 },
                { txt: "Es un Requerimiento Funcional.", correct: false, feed: "❌ Es una meta de alto nivel, no la función específica aún.", costR: -5, costB: 0 },
                { txt: "Es un Goal de Mantenimiento (Maintenance).", correct: true, feed: "✅ Correcto. Define una restricción de integridad (Safety Condition).", costR: 15, costB: 0 }
            ]
        },
        {
            id: 'estimator', name: 'Estimador', role: 'Planificación', x: 32, z: 18, color: 0x0ea5e9,
            text: "En Function Points, ¿qué es 'Consultar Saldo' (muestra datos sin procesar ni guardar)?",
            opts: [
                { txt: "Entrada Externa (EI).", correct: false, feed: "❌ No, porque no altera datos internos.", costR: -10, costB: 0 },
                { txt: "Archivo Lógico Interno (ILF).", correct: false, feed: "❌ No, eso son los datos en reposo, no la transacción.", costR: -10, costB: 0 },
                { txt: "Consulta Externa (EQ).", correct: true, feed: "✅ Correcto. Recupera datos sin lógica matemática compleja ni alteración.", costR: 10, costB: 5 }
            ]
        },
        {
            id: 'soporte', name: 'Jefe Soporte', role: 'Operaciones', x: 18, z: 32, color: 0x10b981,
            text: "Me ignoraron en las reuniones. ¿Soy un Stakeholder?",
            opts: [
                { txt: "No, solo los usuarios importan.", correct: false, feed: "❌ Error crítico. Si Soporte no puede operar el sistema, el proyecto fracasa.", costR: -15, costB: 0 },
                { txt: "Solo si te paga el cliente.", correct: false, feed: "❌ Falso. Eres afectado por el sistema.", costR: -5, costB: 0 },
                { txt: "Sí, eres Crítico para la Operación.", correct: true, feed: "✅ Correcto. Tu visión de desplegabilidad y mantenibilidad es vital.", costR: 10, costB: 0 }
            ]
        },

        // --- FINAL BOSS (Center) ---
        {
            id: 'boss', name: 'EL PROFESOR', role: 'Jefe de Cátedra', x: 0, z: 0, color: 0xffffff, isBoss: true,
            text: "Te voy a tomar el examen final. ¿Cuál es la clave del éxito en Ingeniería de Requerimientos?",
            opts: [
                { txt: "Saber programar muy rápido.", correct: false, feed: "❌ Reprobado. Programar rápido lo incorrecto es desperdicio.", costR: -50, costB: 0 },
                { txt: "Usar muchas herramientas CASE complejas.", correct: false, feed: "❌ Reprobado. Las herramientas no reemplazan al análisis.", costR: -30, costB: -20 },
                { txt: "Gestionar la comunicación y alinear expectativas.", correct: true, feed: "🎓 ¡APROBADO! El software es comunicación. Gestionar el conflicto y el valor es la clave.", costR: 100, costB: 100 }
            ]
        }
    ]
};

// --- THREE.JS ENGINE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);
scene.fog = new THREE.Fog(0x0f172a, 20, 60);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
let cameraAngle = Math.PI / 4; // 45 degrees initial
let cameraZoom = 25;

const renderer = new THREE.WebGLRenderer({ 
    antialias: !detectMobile(), // Disable antialiasing on mobile for performance
    powerPreference: detectMobile() ? 'low-power' : 'high-performance'
});

// Lower pixel ratio on mobile for better performance
const pixelRatio = detectMobile() ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio;
renderer.setPixelRatio(pixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(20, 40, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -30;
dirLight.shadow.camera.right = 30;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
scene.add(dirLight);

// --- ASSETS GENERATION ---

// Materials
const mats = {
    floor: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }),
    wall: new THREE.MeshStandardMaterial({ color: 0x94a3b8 }),
    desk: new THREE.MeshStandardMaterial({ color: 0xc4b5fd }), // Wood-ish
    screen: new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x22d3ee, emissiveIntensity: 0.2 }),
    chair: new THREE.MeshStandardMaterial({ color: 0x475569 }),
    plant: new THREE.MeshStandardMaterial({ color: 0x22c55e }),
    pot: new THREE.MeshStandardMaterial({ color: 0xb45309 }),
    bug: new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x7f1d1d, emissiveIntensity: 0.5 })
};

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mats.floor);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
scene.add(new THREE.GridHelper(80, 80, 0x334155, 0x1e293b));

const colliders = [];

// Helper: Create Box
function createBox(w, h, d, x, y, z, mat, shadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = shadow;
    mesh.receiveShadow = shadow;
    scene.add(mesh);
    return new THREE.Box3().setFromObject(mesh);
}

// Office Layout Generator
function buildOffice() {
    // Exterior Walls
    colliders.push(createBox(80, 6, 2, 0, 3, -40, mats.wall));
    colliders.push(createBox(80, 6, 2, 0, 3, 40, mats.wall));
    colliders.push(createBox(2, 6, 80, -40, 3, 0, mats.wall));
    colliders.push(createBox(2, 6, 80, 40, 3, 0, mats.wall));

    // Interior Partitions (Cruciform layout)
    // Center is open for boss
    
    // Top Left Room (Management)
    colliders.push(createBox(30, 4, 1, -25, 2, -10, mats.wall));
    colliders.push(createBox(1, 4, 20, -10, 2, -30, mats.wall));

    // Top Right Room (Dev)
    colliders.push(createBox(30, 4, 1, 25, 2, -10, mats.wall));
    colliders.push(createBox(1, 4, 20, 10, 2, -30, mats.wall));

    // Bottom Left (Ops)
    colliders.push(createBox(30, 4, 1, -25, 2, 10, mats.wall));
    colliders.push(createBox(1, 4, 20, -10, 2, 30, mats.wall));

    // Bottom Right (Medical/Meeting)
    colliders.push(createBox(30, 4, 1, 25, 2, 10, mats.wall));
    colliders.push(createBox(1, 4, 20, 10, 2, 30, mats.wall));

    // Desks & Decor
    const deskLocs = [
        {x: -25, z: -25}, {x: -25, z: -35}, // Top Left
        {x: 25, z: -25}, {x: 25, z: -35},   // Top Right
        {x: -25, z: 25}, {x: -25, z: 35},   // Bot Left
        {x: 25, z: 25}                      // Bot Right
    ];

    deskLocs.forEach(pos => {
        // Desk
        colliders.push(createBox(4, 1.5, 2, pos.x, 0.75, pos.z, mats.desk));
        // Monitor
        createBox(1, 1, 0.1, pos.x, 2, pos.z, mats.screen, false);
        // Chair
        createBox(1.5, 1.5, 1.5, pos.x, 0.75, pos.z + 2, mats.chair);
    });

    // Plants
    createPlant(-35, -35);
    createPlant(35, -35);
    createPlant(-35, 35);
    createPlant(35, 35);
}

function createPlant(x, z) {
    createBox(1.5, 1.5, 1.5, x, 0.75, z, mats.pot);
    createBox(1, 4, 1, x, 3, z, mats.plant);
    colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 2, z), new THREE.Vector3(2, 4, 2)));
}

buildOffice();

// --- CHARACTER GENERATOR (Voxel Humanoids) ---
function createCharacter(color, x, z, isPlayer = false) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Mats
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const clothesMat = new THREE.MeshStandardMaterial({ color: color });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    // Body Parts
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), skinMat);
    head.position.y = 2.9;
    head.castShadow = true;
    group.add(head);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.5), clothesMat);
    torso.position.y = 1.9;
    torso.castShadow = true;
    group.add(torso);

    // Limbs (Saved for animation)
    const limbs = {};
    
    // Arms
    limbs.armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 0.3), clothesMat);
    limbs.armL.position.set(-0.7, 1.9, 0);
    group.add(limbs.armL);

    limbs.armR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 0.3), clothesMat);
    limbs.armR.position.set(0.7, 1.9, 0);
    group.add(limbs.armR);

    // Legs
    limbs.legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.3, 0.35), darkMat);
    limbs.legL.position.set(-0.25, 0.65, 0);
    group.add(limbs.legL);

    limbs.legR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.3, 0.35), darkMat);
    limbs.legR.position.set(0.25, 0.65, 0);
    group.add(limbs.legR);

    scene.add(group);

    // Floating Indicator for NPCs
    let indicator = null;
    if(!isPlayer) {
        indicator = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 0.5, 4),
            new THREE.MeshBasicMaterial({ color: 0xfacc15 })
        );
        indicator.position.y = 4.5;
        indicator.rotation.z = Math.PI;
        group.add(indicator);
    }

    return { mesh: group, limbs, animOffset: Math.random() * 100, indicator };
}

// --- GAME ENTITIES ---
const player = createCharacter(0x3b82f6, 0, 30, true);
const npcs = [];
const bugs = [];

// Spawn NPCs
GAME_DATA.npcs.forEach(data => {
    const char = createCharacter(data.color, data.x, data.z);
    if(data.isBoss) {
        char.mesh.visible = false;
        char.mesh.scale.set(2.5, 2.5, 2.5); // Jefe gigante
    }
    npcs.push({ data, model: char });
});

// Spawn Bugs (Obstacles)
const bugGeo = new THREE.SphereGeometry(0.6, 8, 8);
for(let i=0; i<6; i++) {
    const bug = new THREE.Mesh(bugGeo, mats.bug);
    // Random pos avoiding center
    let bx = (Math.random() - 0.5) * 60;
    let bz = (Math.random() - 0.5) * 60;
    if(Math.abs(bx) < 10 && Math.abs(bz) < 10) bx += 15;
    
    bug.position.set(bx, 0.6, bz);
    bug.castShadow = true;
    
    // Random direction
    const dir = new THREE.Vector3(Math.random()-0.5, 0, Math.random()-0.5).normalize();
    
    scene.add(bug);
    bugs.push({ mesh: bug, dir: dir, speed: 3 + Math.random() * 2 });
}

// --- GAME LOGIC ---
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if(e.code === 'Space' || e.code === 'KeyE') interact();
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

let activeNPC = null;
let isDialog = false;
let isInvulnerable = false;
let isBossScreenShowing = false;

// --- MOBILE TOUCH CONTROLS ---
let isMobile = false;
let joystickActive = false;
let joystickVector = { x: 0, z: 0 };
let touchRotateLeft = false;
let touchRotateRight = false;

// Detect mobile device
function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Initialize mobile controls
function initMobileControls() {
    isMobile = detectMobile();
    
    if (!isMobile) return;
    
    const joystickContainer = document.getElementById('joystick-container');
    const joystickStick = document.getElementById('joystick-stick');
    const btnRotateLeft = document.getElementById('btn-rotate-left');
    const btnRotateRight = document.getElementById('btn-rotate-right');
    const btnInteract = document.getElementById('btn-interact');
    
    // Joystick touch handling
    let joystickTouch = null;
    const joystickRadius = 60; // Half of base size
    const stickRadius = 25;    // Half of stick size
    
    joystickContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        joystickTouch = e.touches[0];
        joystickActive = true;
        updateJoystick(e.touches[0]);
    });
    
    joystickContainer.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (joystickActive) {
            updateJoystick(e.touches[0]);
        }
    });
    
    joystickContainer.addEventListener('touchend', (e) => {
        e.preventDefault();
        joystickActive = false;
        joystickVector = { x: 0, z: 0 };
        joystickStick.style.transform = 'translate(-50%, -50%)';
    });
    
    function updateJoystick(touch) {
        const rect = joystickContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = joystickRadius - stickRadius;
        
        if (distance > maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }
        
        joystickStick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        
        // Normalize to -1 to 1 range
        joystickVector.x = deltaX / maxDistance;
        joystickVector.z = deltaY / maxDistance;
    }
    
    // Rotation buttons
    btnRotateLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchRotateLeft = true;
    });
    
    btnRotateLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchRotateLeft = false;
    });
    
    btnRotateRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchRotateRight = true;
    });
    
    btnRotateRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchRotateRight = false;
    });
    
    // Interact button
    btnInteract.addEventListener('touchstart', (e) => {
        e.preventDefault();
        interact();
    });
    
    // Update interact button visibility
    setInterval(() => {
        if (activeNPC && !isDialog) {
            btnInteract.style.display = 'flex';
        } else {
            btnInteract.style.display = 'none';
        }
    }, 100);
}

function update(delta) {
    const time = Date.now() * 0.001;

    if(isDialog || isBossScreenShowing) return;

    // Camera Rotation (keyboard or touch)
    if(keys['KeyQ'] || touchRotateLeft) cameraAngle += delta * 2;
    if(keys['KeyE'] || touchRotateRight) cameraAngle -= delta * 2;

    // Player Movement relative to Camera
    const moveSpeed = 10;
    const dir = new THREE.Vector3();
    
    // Calc forward/right vectors based on camera angle
    const forward = new THREE.Vector3(-Math.sin(cameraAngle), 0, -Math.cos(cameraAngle));
    const right = new THREE.Vector3(Math.cos(cameraAngle), 0, -Math.sin(cameraAngle));

    // Keyboard controls
    if(keys['KeyW'] || keys['ArrowUp']) dir.add(forward);
    if(keys['KeyS'] || keys['ArrowDown']) dir.sub(forward);
    if(keys['KeyA'] || keys['ArrowLeft']) dir.sub(right);
    if(keys['KeyD'] || keys['ArrowRight']) dir.add(right);
    
    // Mobile joystick controls
    if(joystickActive && (Math.abs(joystickVector.x) > 0.1 || Math.abs(joystickVector.z) > 0.1)) {
        const joyForward = forward.clone().multiplyScalar(-joystickVector.z);
        const joyRight = right.clone().multiplyScalar(joystickVector.x);
        dir.add(joyForward).add(joyRight);
    }

    let isMoving = false;
    if(dir.lengthSq() > 0) {
        isMoving = true;
        dir.normalize();
        
        // Rotation
        const targetRot = Math.atan2(dir.x, dir.z);
        player.mesh.rotation.y = targetRot;

        // Move & Collide
        const nextPos = player.mesh.position.clone().add(dir.clone().multiplyScalar(moveSpeed * delta));
        const playerBox = new THREE.Box3().setFromCenterAndSize(nextPos, new THREE.Vector3(1, 4, 1));
        
        let collide = false;
        for(let box of colliders) {
            if(playerBox.intersectsBox(box)) { collide = true; break; }
        }

        if(!collide) {
            player.mesh.position.copy(nextPos);
        }
    }

    // Animate Player
    animateHumanoid(player, isMoving, time);

    // Camera Follow
    const camOffX = Math.sin(cameraAngle) * cameraZoom;
    const camOffZ = Math.cos(cameraAngle) * cameraZoom;
    camera.position.x += (player.mesh.position.x + camOffX - camera.position.x) * 0.1;
    camera.position.z += (player.mesh.position.z + camOffZ - camera.position.z) * 0.1;
    camera.position.y = 20;
    camera.lookAt(player.mesh.position);

    // NPCs Logic
    let nearestDist = 999;
    activeNPC = null;

    // Unlock boss?
    const boss = npcs.find(n => n.data.isBoss);
    if(boss && GAME_DATA.completed.length >= 12 && !boss.model.mesh.visible) {
        boss.model.mesh.visible = true;
        showBossScreen();
    }

    npcs.forEach(npc => {
        if(!npc.model.mesh.visible) return;
        
        // Idle Animation
        animateHumanoid(npc.model, false, time);
        if(npc.model.indicator) {
            npc.model.indicator.position.y = 4.5 + Math.sin(time * 4) * 0.2;
            npc.model.indicator.rotation.y += delta;
        }

        // Check distance
        const dist = player.mesh.position.distanceTo(npc.model.mesh.position);
        if(dist < 4) {
            if(!GAME_DATA.completed.includes(npc.data.id)) {
                activeNPC = npc;
                nearestDist = dist;
            }
        }
    });

    // Show prompt
    const prompt = document.getElementById('prompt');
    if(activeNPC) prompt.classList.remove('hidden');
    else prompt.classList.add('hidden');

    // Bugs Logic
    updateBugs(delta, time);
}

function animateHumanoid(char, isMoving, time) {
    const t = time * 10;
    if(isMoving) {
        char.limbs.legL.rotation.x = Math.sin(t) * 0.6;
        char.limbs.legR.rotation.x = Math.cos(t) * 0.6;
        char.limbs.armL.rotation.x = Math.cos(t) * 0.6;
        char.limbs.armR.rotation.x = Math.sin(t) * 0.6;
    } else {
        // Breathing
        const breath = Math.sin(time * 2) * 0.05;
        char.limbs.armL.rotation.z = 0.1 + breath;
        char.limbs.armR.rotation.z = -0.1 - breath;
        char.limbs.legL.rotation.x = 0;
        char.limbs.legR.rotation.x = 0;
    }
}

function updateBugs(delta, time) {
    const pBox = new THREE.Box3().setFromCenterAndSize(player.mesh.position, new THREE.Vector3(1, 2, 1));

    bugs.forEach(bug => {
        // Move
        bug.mesh.position.add(bug.dir.clone().multiplyScalar(bug.speed * delta));
        
        // Bounce walls (Simple bounds check for efficiency)
        if(Math.abs(bug.mesh.position.x) > 38) bug.dir.x *= -1;
        if(Math.abs(bug.mesh.position.z) > 38) bug.dir.z *= -1;

        // Animate pulse
        const s = 1 + Math.sin(time * 10) * 0.2;
        bug.mesh.scale.set(s, s, s);

        // Collision with player
        if(!isInvulnerable) {
            const bBox = new THREE.Box3().setFromObject(bug.mesh);
            if(pBox.intersectsBox(bBox)) {
                takeDamage();
            }
        }
    });
}

function takeDamage() {
    isInvulnerable = true;
    GAME_DATA.reputation = Math.max(0, GAME_DATA.reputation - 5);
    document.getElementById('hud-rep').innerText = GAME_DATA.reputation;
    
    // Visual feedback
    const flash = document.getElementById('damage-flash');
    flash.style.opacity = 1;
    setTimeout(() => flash.style.opacity = 0, 200);

    // Knockback logic could go here
    
    setTimeout(() => isInvulnerable = false, 1500);
}

// --- INTERACTION SYSTEM ---
function interact() {
    if(activeNPC && !isDialog) {
        isDialog = true;
        document.getElementById('prompt').classList.add('hidden');
        const panel = document.getElementById('dialog-panel');
        panel.classList.remove('hidden');

        // 🎯 ANALYTICS: Track stakeholder interaction
        trackStakeholderInteraction(activeNPC.data.id, activeNPC.data.name, activeNPC.data.role);

        // Fill Data
        document.getElementById('npc-name').innerText = activeNPC.data.name;
        document.getElementById('npc-role').innerText = activeNPC.data.role;
        document.getElementById('npc-avatar').style.backgroundColor = '#' + activeNPC.data.color.toString(16);
        document.getElementById('dialog-text').innerText = activeNPC.data.text;

        const cont = document.getElementById('options-container');
        cont.innerHTML = '';
        
        activeNPC.data.opts.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'btn-option p-4 rounded-lg cursor-pointer text-slate-300 font-medium mb-2';
            btn.innerHTML = opt.txt;
            btn.onclick = () => resolveOption(opt);
            cont.appendChild(btn);
        });

        document.getElementById('btn-close').classList.add('hidden');
    }
}

function resolveOption(opt) {
    // Apply Effects
    GAME_DATA.reputation = Math.min(100, Math.max(0, GAME_DATA.reputation + opt.costR));
    GAME_DATA.budget = Math.min(100, Math.max(0, GAME_DATA.budget + opt.costB));
    
    // Update HUD
    document.getElementById('hud-rep').innerText = GAME_DATA.reputation;
    document.getElementById('hud-budget').innerText = GAME_DATA.budget;

    // 🎯 ANALYTICS: Track challenge completion
    trackChallengeCompleted(activeNPC.data.id, activeNPC.data.name, opt.correct);

    // Show Feedback
    const cont = document.getElementById('options-container');
    cont.innerHTML = `
        <div class="p-6 rounded-xl ${opt.correct ? 'bg-green-900/40 border border-green-500' : 'bg-red-900/40 border border-red-500'}">
            <h3 class="font-bold text-xl mb-2 ${opt.correct ? 'text-green-400' : 'text-red-400'}">
                ${opt.correct ? '¡Correcto!' : 'Error de Ingeniería'}
            </h3>
            <p class="text-slate-200 leading-relaxed">${opt.feed}</p>
        </div>
    `;

    if(opt.correct) {
        if(!GAME_DATA.completed.includes(activeNPC.data.id)) {
            GAME_DATA.completed.push(activeNPC.data.id);
            document.getElementById('hud-progress').innerText = GAME_DATA.completed.length;
            
            // 🎯 ANALYTICS: Track level progress
            trackLevelProgress(GAME_DATA.completed.length, 13);
            
            // Remove indicator
            if(activeNPC.model.indicator) {
                activeNPC.model.mesh.remove(activeNPC.model.indicator);
            }
        }
    }

    document.getElementById('btn-close').classList.remove('hidden');
}

window.closeDialog = function() {
    document.getElementById('dialog-panel').classList.add('hidden');
    isDialog = false;
    
    // End Game Check
    if(GAME_DATA.completed.length >= 13 && activeNPC && activeNPC.data.isBoss) {
        showWinScreen();
    }
};

function showWinScreen() {
    // Update final stats
    document.getElementById('final-rep').innerText = GAME_DATA.reputation + '%';
    document.getElementById('final-budget').innerText = '$' + GAME_DATA.budget + 'k';
    
    // 🎯 ANALYTICS: Track game completion
    const totalTime = clock.getElapsedTime(); // Get total time from clock
    trackGameComplete(GAME_DATA.reputation, GAME_DATA.budget, totalTime);
    
    // Show screen
    document.getElementById('win-screen').classList.remove('hidden');
}

function showBossScreen() {
    isBossScreenShowing = true;
    document.getElementById('boss-screen').classList.remove('hidden');
    
    // 🎯 ANALYTICS: Track boss unlocked
    trackBossUnlocked();
}

window.closeBossScreen = function() {
    document.getElementById('boss-screen').classList.add('hidden');
    isBossScreenShowing = false;
};

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    update(delta);
    renderer.render(scene, camera);
}

// Init
document.getElementById('loader').style.display = 'none';
initMobileControls();
animate();

