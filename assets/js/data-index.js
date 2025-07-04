// data.js - This file contains all the static data for the CV,
// including personal info, projects, experience, education, and skills.

// =================================================================================
// --- 1. DATA AND GLOBAL VARIABLES
// =================================================================================

// Tech Stack organized by categories - only concrete technologies listed
export const techStackData = {
    "Fullstack & Data": [
        "Python", "Java", "Kotlin", "Go", "R", "SQL", "MySQL", "MariaDB", "PostgreSQL", 
        "MongoDB", "Firebase", "PyPI", "Spring", "Django", "Flask", "FastAPI", "SQLite",
        "JavaScript", "HTML", "CSS"
    ],
    "Machine Learning": [
        "Scikit-learn", "TensorFlow", "Keras", "PyTorch", "Caret", "OpenCV", 
        "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly", "GeoPandas"
    ],
    "AI & Automation": [
        "LLM", "RAG", "GitHub Copilot", "n8n", "Zapier", "Windsurf", "Cursor", "AI"
    ],
    "Cloud & DevOps": [
        "Google Cloud", "AWS", "Azure", "Apache Airflow", "dbt"
    ],
    "Business Intelligence": [
        "Looker", "Looker Studio", "Power BI", "Tableau", "DataFlow", "DataMesh", 
        "Shiny", "Dplyr", "Ggplot2", "Amplitude", "MicroStrategy"
    ],
    "Developer Tools": [
        "Git", "Jupyter", "Terminal", "Figma"
    ],
    "Productivity & Management": [
        "Jira", "Notion", "Monday", "Trello", "Google Suite", "Microsoft Office",
        "Product Management", "Agile"
    ],
    "Soft Skills": [
        "Leadership", "Communication", "Soft Skills", "Problem Solving", "Critical Thinking",
        "Team Management", "Mentoring", "Public Speaking", "Negotiation", "Time Management",
        "Adaptability", "Creativity", "Emotional Intelligence", "Conflict Resolution"
    ],
    "Cybersecurity": [
        "Hacking", "Pentesting", "Ciberseguridad", "Desarrollo Seguro", "Hacking ético", "Seguridad", "SSDLC"
    ],
    "Other": [
        "Blockchain"
    ]
};

// Updated projects with only concrete technology tags
export const projectsData = [
    { 
        id: 1, 
        tags: ['Python', 'Pandas', 'PyPI', 'Git', 'Terminal'], 
        title: { es: "[Python-Pandas] Paquete PyPI Missing-mga", en: "[Python-Pandas] Missing-mga Pandas API extends PyPI package" }, 
        description: { es: "Este paquete extiende la funcionalidad de Pandas DataFrame introduciendo una clase de Métodos de Ausencia, permitiendo un manejo intuitivo de valores faltantes.", en: "This package extends Pandas DataFrame functionality by introducing a Missing Methods class, enabling intuitive handling of missing values." }, 
        link: "https://github.com/Mgobeaalcoba/missing_mga" 
    }, 
    { 
        id: 2, 
        tags: ['Python', 'Django', 'SQLite', 'Git', 'Terminal', 'HTML', 'CSS'], 
        title: { es: "[Python-Django] Web App para mi proyecto profesional personal", en: "[Python-Django] Web App for my personal professional project" }, 
        description: { es: "Aplicación web Fullstack creada con Django que combina habilidades de frontend y backend, incluyendo endpoints, administración de bases de datos y conexión con servicios externos.", en: "Fullstack Web App created with Django combining front and back skills, including endpoints, database administration, and connection with external services." }, 
        link: "https://github.com/Mgobeaalcoba/matrix-global-analytics-webapp" 
    }, 
    { 
        id: 3, 
        tags: ['Python', 'Kaggle API', 'Git', 'Terminal'], 
        title: { es: "[Python-Kaggle] Paquete Kaggle Downloader", en: "[Python-Kaggle] Kaggle Downloader Package" }, 
        description: { es: "Una clase de Python que simplifica la interacción con Kaggle para la búsqueda, descarga y extracción de datasets.", en: "A Python class that simplifies interaction with Kaggle for searching, downloading, and extracting datasets." }, 
        link: "https://github.com/Mgobeaalcoba/kaggle_downloader_package" 
    }, 
    { 
        id: 4, 
        tags: ['Python', 'PyPI', 'DolarApi', 'Git', 'Terminal'], 
        title: { es: "[Python-Package] Paquete PyPi Argendolar", en: "[Python-Package] Argendolar PyPi package" }, 
        description: { es: "Paquete de Python que facilita la obtención de tasas de cambio del peso argentino usando APIs como DolarApi.", en: "Python package that facilitates obtaining exchange rates for the Argentine peso using APIs like DolarApi." }, 
        link: "https://github.com/Mgobeaalcoba/argendolar" 
    }, 
    { 
        id: 5, 
        tags: ['Python', 'FastAPI', 'Mathematics', 'Git', 'Terminal'], 
        title: { es: "[Python - FastApi] Proyecto Quasar Fire", en: "[Python - FastApi] Quasar Fire Project" }, 
        description: { es: "API RESTful para determinar la ubicación de una señal de auxilio en el espacio mediante trilateración.", en: "RESTful API to determine the location of a distress signal in space through trilateration." }, 
        link: "https://github.com/Mgobeaalcoba/quasar-fire" 
    }, 
    { 
        id: 6, 
        tags: ['Python', 'Django', 'SQLite', 'Git', 'Terminal', 'HTML', 'CSS'], 
        title: { es: "[Python-Django] App Web de Lista de Tareas", en: "[Python-Django] To Do List Web App" }, 
        description: { es: "Aplicación web en Django para gestionar tareas y listas de quehaceres de manera eficiente.", en: "Web application in Django to efficiently manage tasks and to-do lists." }, 
        link: "https://github.com/Mgobeaalcoba/django_python" 
    }, 
    { 
        id: 7, 
        tags: ['Python', 'OpenCV', 'Face Recognition', 'Git', 'Terminal'], 
        title: { es: "[Python-FaceRecognition] Validador de Asistencia Facial", en: "[Python-FaceRecognition] Face Assistance Validator" }, 
        description: { es: "App de verificación facial y control de acceso utilizando Python, OpenCV y Face-recognition.", en: "Facial verification and access control app using Python, OpenCV, and Face-recognition." }, 
        link: "https://github.com/Mgobeaalcoba/face_assistance_validator" 
    }, 
    { 
        id: 8, 
        tags: ['Python', 'Pygame', 'Git', 'Terminal'], 
        title: { es: "[Python-Pygame] Videojuego Space Invasion", en: "[Python-Pygame] Space Invasion Videogame" }, 
        description: { es: "Juego 'Space Invasion' creado 100% con Pygame y Python, aplicando POO y patrones de diseño.", en: "'Space Invasion' game created 100% with Pygame and Python, applying OOP and design patterns." }, 
        link: "https://github.com/Mgobeaalcoba/pygame_space_invasion" 
    }, 
    { 
        id: 9, 
        tags: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Git', 'Terminal'], 
        title: { es: "[Python-Scikit Learn] Predictor de Supervivencia en el Titanic", en: "[Python-Scikit Learn] Survival Predictor On The Titanic" }, 
        description: { es: "Modelo de Machine Learning y análisis para predecir la supervivencia de pasajeros en el Titanic.", en: "Machine Learning model and analysis to predict passenger survival on the Titanic." }, 
        link: "https://github.com/Mgobeaalcoba/survival_predictor_on_the_titanic_sci_kit_learn" 
    }, 
    { 
        id: 10, 
        tags: ['Python', 'Speech Recognition', 'NLP', 'Git', 'Terminal'], 
        title: { es: "[Python - SpeechRecognition] Asistente de Voz", en: "[Python - SpeechRecognition] Voice Assistant" }, 
        description: { es: "Asistente de voz basado en Python que utiliza librerías de NLP y reconocimiento de voz.", en: "Python-based voice assistant using NLP and speech recognition libraries." }, 
        link: "https://github.com/Mgobeaalcoba/voice_assistant" 
    }, 
    { 
        id: 11, 
        tags: ['Python', 'Tkinter', 'Git', 'Terminal'], 
        title: { es: "[Python - Tkinter] Software de Escritorio para Restaurante", en: "[Python - Tkinter] Restaurant Desktop Software" }, 
        description: { es: "Software de escritorio versátil construido con Python y la librería Tkinter GUI.", en: "Versatile desktop software built with Python and the Tkinter GUI library." }, 
        link: "https://github.com/Mgobeaalcoba/restaurant_desktop_software_tkinter" 
    }, 
    { 
        id: 12, 
        tags: ['R', 'Shiny', 'Dplyr', 'Ggplot2', 'Git', 'Terminal'], 
        title: { es: "[R-Shiny] App en Shiny para EDA de Lenguajes de Programación", en: "[R-Shiny] Programming Languages EDA Shiny App" }, 
        description: { es: "App en R/Shiny para un desafío de Cohen Allados Financieros, realizando un EDA sobre un dataset de tidytuesday.", en: "R/Shiny app for a Cohen Allados Financieros challenge, performing an EDA on a tidytuesday dataset." }, 
        link: "https://github.com/Mgobeaalcoba/cohen_challenge_shiny_app" 
    }, 
    { 
        id: 13, 
        tags: ['Kotlin', 'Go', 'Spring', 'Google Cloud', 'Git', 'Terminal'], 
        title: { es: "[Kotlin-Spring] Api Rest Trilateración", en: "[Kotlin-Spring] Api Rest Trilateration" }, 
        description: { es: "Rest Api construida en GCP como parte de un desafío interno en Mercado Libre, utilizando Kotlin y Spring.", en: "Rest Api built on GCP as part of an internal challenge at Mercado Libre, using Kotlin and Spring." }, 
        link: "https://github.com/Mgobeaalcoba/api_rest_meli_challenge_public" 
    }, 
    { 
        id: 14, 
        tags: ['Python', 'Django', 'SQLite', 'Git', 'Terminal', 'HTML', 'CSS'], 
        title: { es: "[Python-Django] Modelo de App Web", en: "[Python-Django] Web App Model" }, 
        description: { es: "App en Django que permite registro, login, y gestión de tareas pendientes.", en: "Django app that allows registration, login, and to-do list management." }, 
        link: "https://github.com/Mgobeaalcoba/django_python" 
    }, 
    { 
        id: 15, 
        tags: ['Python', 'Flask', 'MySQL', 'Git', 'Terminal'], 
        title: { es: "[Python - Flask] App CRUD", en: "[Python - Flask] CRUD App" }, 
        description: { es: "Una app hecha con Python y Flask que no es más que un software CRUD.", en: "An app made with Python and Flask that is a CRUD software." }, 
        link: "https://github.com/Mgobeaalcoba/flask_python" 
    }, 
    { 
        id: 16, 
        tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Git', 'Terminal'], 
        title: { es: "[Python - Pandas] Datacademy", en: "[Python - Pandas] Datacademy" }, 
        description: { es: "Proyecto diseñado como parte de una competencia de Análisis Exploratorio de Datos usando Python y sus librerías.", en: "Project designed as part of an Exploratory Data Analysis competition using Python and its libraries." }, 
        link: "https://github.com/Mgobeaalcoba/datacademy" 
    }
];

export const experienceData = [
    { 
        id: 1, 
        date: { es: "Ene 2025 - actualidad", en: "Jan 2025 - Present" }, 
        title: { es: "Data & Analytics Technical Leader", en: "Data & Analytics Technical Leader" }, 
        company: "Mercado Libre", 
        tags: ["Python", "LLM", "RAG", "TensorFlow", "Google Cloud", "Apache Airflow", "dbt", "n8n", "Zapier", "Looker", "Power BI", "Git", "Terminal", "Leadership"],
        description: { es: `<li>Lideré un equipo de +5 analistas y científicos de datos, impulsando una cultura de innovación que permitió aumentar un 30% la adopción de soluciones de IA en áreas clave del negocio.</li><li>Alineé la estrategia de Data & Analytics con los objetivos corporativos priorizando iniciativas de alto impacto que contribuyeron a aumentar la eficiencia operativa en un 20%.</li><li>Fomenté una cultura de alto rendimiento mediante mentoring, programas de upskilling y metodologías ágiles, elevando el eNPS del equipo en más de 25 puntos en menos de un año.</li><li>Implementé soluciones analíticas que redujeron el tiempo de análisis de datos en un 40%, mediante modelos predictivos, dashboards dinámicos y automatización de reportes.</li><li>Diseñé e implementé arquitecturas RAG para sistemas de knowledge management, mejorando la precisión contextual de las respuestas generadas por LLMs en un 35%.</li><li>Entrené y desplegué modelos fine-tuned de transformers (BERT, GPT) que optimizaron procesos de clasificación de textos y análisis de sentimiento, mejorando KPIs de automatización en atención al cliente en un 20%.</li><li>Lideré la evaluación y adopción de tecnologías emergentes (MLOps, vector DBs, LLMs), manteniendo al equipo a la vanguardia y acelerando el time-to-market de soluciones de IA en un 50%.</li><li>Impulsé proyectos de transformación basada en datos que resolvieron desafíos complejos de negocio, generando +USD 500K en impacto estimado anual.</li><li>Diseñé arquitecturas de datos escalables para el procesamiento de grandes volúmenes de información, logrando una mejora del 45% en la performance de pipelines ETL.</li><li>Establecí procesos robustos de calidad de datos (validación, limpieza, estandarización), aumentando la confiabilidad de los dashboards ejecutivos y reduciendo errores críticos en un 70%.</li><li>Automaticé workflows analíticos complejos con Apache Airflow, dbt, n8n y Zapier, eliminando tareas manuales y mejorando la eficiencia operativa del equipo en un 60%.</li>`, en: `<li>Led a team of +5 analysts and data scientists, fostering a culture of innovation that increased AI solution adoption by 30% in key business areas.</li><li>Aligned Data & Analytics strategy with corporate objectives, prioritizing high-impact initiatives that increased operational efficiency by 20%.</li><li>Fostered a high-performance culture through mentoring, upskilling, and agile methodologies, raising team eNPS by over 25 points in less than a year.</li><li>Implemented analytical solutions that reduced data analysis time by 40% through predictive models, dynamic dashboards, and report automation.</li><li>Designed and implemented RAG architectures for knowledge management systems, improving contextual accuracy of LLM responses by 35%.</li><li>Trained and deployed fine-tuned transformer models (BERT, GPT) that optimized text classification and sentiment analysis processes, improving customer service automation KPIs by 20%.</li><li>Led the evaluation and adoption of emerging technologies (MLOps, vector DBs, LLMs), keeping the team at the forefront and accelerating the time-to-market for AI solutions by 50%.</li><li>Drove data-driven transformation projects that solved complex business challenges, generating an estimated annual impact of +USD 500K.</li><li>Designed scalable data architectures for processing large volumes of information, achieving a 45% improvement in ETL pipeline performance.</li><li>Established robust data quality processes (validation, cleaning, standardization), increasing the reliability of executive dashboards and reducing critical errors by 70%.</li><li>Automated complex analytical workflows with Apache Airflow, dbt, n8n, and Zapier, eliminating manual tasks and improving team operational efficiency by 60%.</li>` }
    }, 
    { 
        id: 2, 
        date: { es: "Dic 2023 - Ene 2025", en: "Dec 2023 - Jan 2025" }, 
        title: { es: "Sr Data & Analytics Engineer", en: "Sr. Data & Analytics Engineer" }, 
        company: "Mercado Libre", 
        tags: ["Python", "SQL", "Google Cloud", "AWS", "Power BI", "Looker", "Jira", "Git", "Terminal"],
        description: { es: `<li>Diseñé, construí y mantuve el modelo de datos de login (MP, ML, ME), asegurando su disponibilidad y confiabilidad a nivel organizacional.</li><li>Desarrollé dashboards estratégicos para monitorear métricas clave como conversión de login, recuperación de cuentas y uso de factores de autenticación.</li><li>Automaticé la actualización diaria de los modelos de datos mediante scripts eficientes, reduciendo significativamente el costo operativo y la intervención manual.</li><li>Generé insights accionables a través de reportes, dashboards y tablas ad hoc, facilitando la medición del impacto de nuevas funcionalidades de login.</li><li>Coordiné con equipos de Producto para alinear los entregables analíticos con el roadmap, garantizando una correcta interpretación de resultados y visualizaciones.</li><li>Construí una API REST desde cero para analizar transacciones de login y automatizar decisiones en Customer Experience, Prevención de Fraude y GIN.</li><li>Lideré la migración del modelo de autenticación de Amazon Athena a Google BigQuery, mejorando la escalabilidad, velocidad y mantenibilidad de la infraestructura de datos.</li><li>Desarrollé nuevas funcionalidades en el sistema Auth-Login, contribuyendo a la mejora continua de un producto core del ecosistema de autenticación.</li><li>Optimicé pipelines de procesamiento de datos, mejorando su rendimiento y garantizando disponibilidad en tiempo real para servicios críticos.</li><li>Implementé prácticas de seguridad avanzadas en los procesos de autenticación, fortaleciendo la protección del acceso de usuarios y la robustez del sistema.</li>`, en: `<li>Designed, built, and maintained the login data model (MP, ML, ME), ensuring its organizational availability and reliability.</li><li>Developed strategic dashboards to monitor key metrics such as login conversion, account recovery, and use of authentication factors.</li><li>Automated the daily update of data models through efficient scripts, significantly reducing operational cost and manual intervention.</li><li>Generated actionable insights through reports, dashboards, and ad hoc tables, facilitating the impact measurement of new login functionalities.</li><li>Coordinated with Product teams to align analytical deliverables with the roadmap, ensuring correct interpretation of results and visualizations.</li><li>Built a REST API from scratch to analyze login transactions and automate decisions in Customer Experience, Fraud Prevention, and GIN.</li><li>Led the migration of the authentication model from Amazon Athena to Google BigQuery, improving the scalability, speed, and maintainability of the data infrastructure.</li><li>Developed new features in the Auth-Login system, contributing to the continuous improvement of a core product in the authentication ecosystem.</li><li>Optimized data processing pipelines, improving their performance and ensuring real-time availability for critical services.</li><li>Implemented advanced security practices in authentication processes, strengthening user access protection and system robustness.</li>` }
    }, 
    { 
        id: 3, 
        date: { es: "May 2022 - Dic 2023", en: "May 2022 - Dec 2023" }, 
        title: { es: "Shipping Product Owner", en: "Shipping Product Owner" }, 
        company: "Mercado Libre", 
        tags: ["Jira", "Notion", "Power BI", "SQL", "Agile", "Product Management"],
        description: { es: `<li>Detecté oportunidades de mejora y nuevas funcionalidades a partir del análisis de datos de uso y feedback de usuarios, contribuyendo a la evolución continua del producto.</li><li>Colaboré con equipos de desarrollo y áreas de negocio para definir la estrategia y roadmap del producto, asegurando la alineación con los objetivos corporativos.</li><li>Realicé análisis de mercado y competencia para sustentar decisiones estratégicas, permitiendo identificar ventajas diferenciais y ajustar el posicionamiento del producto.</li><li>Aseguré estándares de calidad y una experiencia de usuario óptima a través de pruebas funcionales, validaciones de UX y mejoras iterativas basadas en métricas.</li><li>Gestioné el backlog priorizando funcionalidades según impacto y viabilidad, mejorando la eficiencia en la entrega y el enfoque en valor para el usuario.</li><li>Coordiné con el equipo técnico para garantizar claridad en los objetivos, prioridades y dependencias, facilitando una ejecución ágil y alineada.</li><li>Monitoreé métricas clave de negocio y producto (adopción, conversión, retención), impulsando decisiones de optimización que aumentaron la performance del producto.</li><li>Comuniqué avances, decisiones y métricas a stakeholders, fomentando una visión integrada y compartida entre producto, tech, negocio y diseño.</li>`, en: `<li>Identified improvement opportunities and new functionalities from usage data analysis and user feedback, contributing to the continuous evolution of the product.</li><li>Collaborated with development and business teams to define the product strategy and roadmap, ensuring alignment with corporate objectives.</li><li>Conducted market and competitor analysis to support strategic decisions, identifying differential advantages and adjusting product positioning.</li><li>Ensured quality standards and an optimal user experience through functional tests, UX validations, and iterative improvements based on metrics.</li><li>Managed the backlog by prioritizing functionalities according to impact and feasibility, improving delivery efficiency and focus on user value.</li><li>Coordinated with the technical team to ensure clarity on objectives, priorities, and dependencies, facilitating agile and aligned execution.</li><li>Monitored key business and product metrics (adoption, conversion, retention), driving optimization decisions that increased product performance.</li><li>Communicated progress, decisions, and metrics to stakeholders, fostering an integrated and shared vision among product, tech, business, and design.</li>` }
    }, 
    { 
        id: 4, 
        date: { es: "Ene 2021 - Jun 2022", en: "Jan 2021 - Jun 2022" }, 
        title: { es: "Cross Docking Sr. Analyst", en: "Sr. Cross Docking Analyst" }, 
        company: "Mercado Libre", 
        tags: ["Power BI", "SQL", "Excel"],
        description: { es: `<li>Estandaricé KPIs y reportes a nivel regional, definiendo métricas clave que permitieron un análisis consistente y comparativo entre países y unidades operativas.</li><li>Implementé un sistema de monitoreo de indicadores operativos críticos, optimizando la eficiencia del negocio y mejorando la experiencia del cliente en puntos clave del journey.</li><li>Lideré iniciativas de mejora continua en operaciones de cross docking en MLA, logrando reducciones en tiempos de procesamiento y costos logísticos.</li><li>Coordiné directamente con operadores logísticos (3PL), negociando acuerdos y planificando acciones que mejoraron el rendimiento y la confiabilidad del servicio.</li><li>Planifiqué y executé la expansión de infraestructura logística mediante la apertura de nuevos centros de cross docking en Argentina, aumentando la capacidad operativa y reduciendo costos de botella.</li>`, en: `<li>Standardized KPIs and reports at a regional level, defining key metrics that allowed for consistent and comparative analysis between countries and operational units.</li><li>Implemented a monitoring system for critical operational indicators, optimizing business efficiency and improving the customer experience at key journey points.</li><li>Led continuous improvement initiatives in cross-docking operations in MLA, achieving reductions in processing times and logistics costs.</li><li>Coordinated directly with logistics operators (3PL), negotiating agreements and planning actions that improved service performance and reliability.</li><li>Planned and executed the expansion of logistics infrastructure through the opening of new cross-docking centers in Argentina, increasing operational capacity and reducing bottleneck costs.</li>` }
    }, 
    { 
        id: 5, 
        date: { es: "Ago 2020 - Ene 2021", en: "Aug 2020 - Jan 2021" }, 
        title: { es: "Cross Docking Ssr. Analyst", en: "Ssr. Cross Docking Analyst" }, 
        company: "Mercado Libre", 
        tags: ["Excel", "Power BI"],
        description: { es: `<li>Monitoreé y analicé KPIs operativos como Out On Time, In On Time y NPS de forma diaria, contribuyendo a la optimización de la operación de Mercado Envíos.</li><li>Detecté oportunidades de mejora a través del análisis de procesos operativos, impulsando acciones correctivas que elevaron la eficiencia y calidad del servicio.</li><li>Diseñé e implementé planes de capacitación para equipos operativos, mejorando los tiempos de ejecución y fortaleciendo el cumplimiento de estándares internos.</li><li>Realicé auditorías a proveedores logísticos, evaluando su desempeño y garantizando el cumplimiento de los niveles de servicio establecidos por la compañía.</li>`, en: `<li>Monitored and analyzed operational KPIs such as Out On Time, In On Time, and NPS on a daily basis, contributing to the optimization of the Mercado Envíos operation.</li><li>Identified improvement opportunities through the analysis of operational processes, driving corrective actions that increased service efficiency and quality.</li><li>Designed and implemented training plans for operational teams, improving execution times and strengthening compliance with internal standards.</li><li>Conducted audits of logistics providers, evaluating their performance and ensuring compliance with the service levels established by the company.</li>` }
    }, 
    { 
        id: 6, 
        date: { es: "May 2019 - Ago 2020", en: "May 2019 - Aug 2020" }, 
        title: { es: "Cross Docking Team Leader", en: "Cross Docking Team Leader" }, 
        company: "Mercado Libre", 
        tags: ["Excel", "Leadership"],
        description: { es: `<li>Lideré y coordiné equipos operativos en inbound, sorting, outbound y dispatch, asegurando el cumplimiento consistente de objetivos clave de productividad y calidad.</li><li>Fomenté una cultura de trabajo motivadora, equilibrando la priorización de metas con el bienestar y disfrute del equipo, aumentando el compromiso y la retención.</li><li>Implementé procesos de feedback individual y grupal, junto con actividades motivacionales y planes de desarrollo, mejorando el desempeño y la cohesión del equipo.</li><li>Optimicé la gestión de tiempos productivos, ausencias y llegadas tardías, incrementando la eficiencia operativa y reduciendo pérdidas de productividad.</li><li>Analicé el desempeño del equipo y diseñé estrategias de mejora continua que incrementaron la productividad general de la operación.</li>`, en: `<li>Led and coordinated operational teams in inbound, sorting, outbound, and dispatch, ensuring consistent achievement of key productivity and quality objectives.</li><li>Fostered a motivating work culture, balancing goal prioritization with team well-being and enjoyment, increasing commitment and retention.</li><li>Implemented individual and group feedback processes, along with motivational activities and development plans, improving team performance and cohesion.</li><li>Optimized the management of productive times, absences, and late arrivals, increasing operational efficiency and reducing productivity losses.</li><li>Analyzed team performance and designed continuous improvement strategies that increased the overall productivity of the operation.</li>` }
    }, 
    { 
        id: 7, 
        date: { es: "Dic 2024 - actualidad", en: "Dec 2024 - Present" }, 
        title: { es: "Data & Analytics Expert", en: "Data & Analytics Expert" }, 
        company: "Henry", 
        tags: ["Power BI", "Excel", "Looker Studio"],
        description: { es: `<li>Liderazgo académico en Data & Analytics: Diseño de experiencias educativas transformadoras en herramientas clave como Power BI, Excel y Looker Studio.</li><li>Diseño instruccional y estructuración de contenidos: Maquetación de cursos con enfoque pedagógico, definiendo temáticas, secuencia de aprendizaje y recursos didácticos.</li><li>Desarrollo de proyectos aplicados: Creación de proyectos integradores que promueven el aprendizaje activo y la aplicación práctica de conceptos.</li><li>Elaboración de materiales didácticos de calidad: Redacción de soluciones, ejercicios y explicaciones detalladas que fortalecen el proceso de aprendizaje.</li><li>Planificación académica estratégica: Definición de programas de curso con objetivos claros, cronograma preciso y criterios de evaluación alineados al perfil profesional buscado.</li>`, en: `<li>Academic leadership in Data & Analytics: Designing transformative educational experiences in key tools like Power BI, Excel, and Looker Studio.</li><li>Instructional design and content structuring: Course layout with a pedagogical approach, defining themes, learning sequences, and didactic resources.</li><li>Development of applied projects: Creation of integrative projects that promote active learning and the practical application of concepts.</li><li>Elaboration of quality didactic materials: Writing solutions, exercises, and detailed explanations that strengthen the learning process.</li><li>Strategic academic planning: Definition of course programs with clear objectives, precise schedules, and evaluation criteria aligned with the desired professional profile.</li>` }
    }, 
    { 
        id: 8, 
        date: { es: "May 2024 - actualidad", en: "May 2024 - Present" }, 
        title: { es: "Data Analytics Instructor", en: "Data Analytics Instructor" }, 
        company: "Henry", 
        tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn", "Git", "Terminal", "Jupyter"],
        description: { es: `<li>Instructor de Data Analytics con foco en Python: Facilitación de clases teóricas y prácticas orientadas a la manipulación de datos, visualización y modelado estadístico.</li><li>Desarrollo de contenido educativo de alto impacto: Creación de presentaciones, ejercicios y proyectos alineados con las competencias clave del análisis de datos.</li><li>Acompañamiento personalizado al estudiante: Provisión de feedback individualizado y seguimiento constante para maximizar el aprendizaje y el desarrollo de habilidades.</li><li>Vinculación con la industria y actualización permanente: Colaboración con profesionales del sector y adopción de buenas prácticas en educación y ciencia de datos.</li><li>Pasión por la enseñanza y el crecimiento profesional: Compromiso con la formación de nuevos talentos en data analytics y la excelencia académica.</li>`, en: `<li>Data Analytics Instructor with a focus on Python: Facilitating theoretical and practical classes aimed at data manipulation, visualization, and statistical modeling.</li><li>Development of high-impact educational content: Creation of presentations, exercises, and projects aligned with key data analysis competencies.</li><li>Personalized student support: Providing individualized feedback and constant monitoring to maximize learning and skill development.</li><li>Industry linkage and continuous updating: Collaboration with industry professionals and adoption of best practices in education and data science.</li><li>Passion for teaching and professional growth: Commitment to training new talent in data analytics and academic excellence.</li>` }
    }, 
    { 
        id: 9, 
        date: { es: "Mar 2024 - actualidad", en: "Mar 2024 - Present" }, 
        title: { es: "Adjunct Professor", en: "Adjunct Professor" }, 
        company: "UADE", 
        tags: ["Python", "Java", "Git", "Terminal"],
        description: { es: `<li>Docente de programación en nivel universitario: Liderazgo en la formación de estudiantes en su primer contacto formal con la programación, asegurando una base sólida para su desarrollo académico y profesional.</li><li>Diseño y actualización de programas de estudio: Desarrollo del plan académico del Taller de Programación I, incorporando buenas prácticas y tendencias actuales en el ámbito del software.</li><li>Facilitación de clases teóricas y prácticas: Enseñanza de fundamentos clave de programación a través de metodologías activas, fomentando la comprensión y aplicación de conceptos.</li><li>Acompañamiento y tutoría personalizada: Apoyo continuo a los estudiantes mediante asesorías individuales y grupales, promoviendo el aprendizaje autónomo y colaborativo.</li><li>Enfoque en pensamiento lógico y resolución de problemas: Estímulo del pensamiento crítico mediante ejercicios prácticos, proyectos integradores y desafíos reales.</li>`, en: `<li>University-level programming instructor: Leading the training of students in their first formal contact with programming, ensuring a solid foundation for their academic and professional development.</li><li>Design and updating of study programs: Development of the academic plan for Programming Workshop I, incorporating best practices and current trends in the software field.</li><li>Facilitation of theoretical and practical classes: Teaching key programming fundamentals through active methodologies, fostering the understanding and application of concepts.</li><li>Personalized support and tutoring: Continuous support for students through individual and group advising, promoting autonomous and collaborative learning.</li><li>Focus on logical thinking and problem-solving: Encouraging critical thinking through practical exercises, integrative projects, and real-world challenges.</li>` }
    }, 
    { 
        id: 10, 
        date: { es: "Feb 2011 - Feb 2019", en: "Feb 2011 - Feb 2019" }, 
        title: { es: "Warehouse Supervisor / Operations Sr. Analyst", en: "Warehouse Supervisor / Operations Sr. Analyst" }, 
        company: "El Portugues", 
        tags: ["Excel"],
        description: { es: `<li>Supervisión operativa de centro logístico: Gestión integral de un warehouse de 3.500 posiciones, asegurando el correcto funcionamiento de las operaciones logísticas.</li><li>Coordinación de procesos clave: Supervisión de la recepción, almacenamiento, preparación y despacho de mercadería, insumos, materias primas y pañol.</li><li>Manejo de flota de transporte: Coordinación de envíos mediante camiones propios y operadores logísticos externos (fleteros), optimizando tiempos y eficiencia.</li><li>Atención a clientes de primera línea: Gestión de operaciones logísticas para empresas líderes como Arcor, La Anónima, Los Marías, Flora-Dánica y PepsiCo.</li><li>Control de inventarios y operaciones: Aseguramiento del correcto registro y flujo de stock dentro del almacén, manteniendo altos estándares de orden y trazabilidad.</li><li>Gestión administrativa de proveedores logísticos: Atención y seguimiento de fleteros: liquidación de haberes, elaboración de tarifas, descuentos por repuestos y adelantos a cuenta de la compañía.</li><li>Control y conciliación de cuentas corrientes: Supervisión de gastos asociados a transporte (YPF, Rutas, telepeaje, estaciones de servicio del interior) y resolución de reclamos.</li>`, en: `<li>Operational supervision of logistics center: Comprehensive management of a 3,500-position warehouse, ensuring the correct functioning of logistics operations.</li><li>Coordination of key processes: Supervision of the reception, storage, preparation, and dispatch of merchandise, supplies, raw materials, and tools.</li><li>Transportation fleet management: Coordination of shipments using company-owned trucks and external logistics operators, optimizing time and efficiency.</li><li>Service to first-line clients: Management of logistics operations for leading companies such as Arcor, La Anónima, Los Marías, Flora-Dánica, and PepsiCo.</li><li>Inventory and operations control: Ensuring the correct registration and flow of stock within the warehouse, maintaining high standards of order and traceability.</li><li>Administrative management of logistics providers: Attention and follow-up with freight forwarders: payment settlement, rate setting, spare parts discounts, and company advances.</li><li>Current account control and reconciliation: Supervision of transportation-related expenses (YPF, tolls, service stations) and claim resolution.</li>` }
    }, 
    { 
        id: 11, 
        date: { es: "Ene 2010 - Feb 2011", en: "Jan 2010 - Feb 2011" }, 
        title: { es: "Backoffice Analyst", en: "Backoffice Analyst" }, 
        company: "SOLDA-LIMP S.R.L.", 
        tags: ["Excel"],
        description: { es: `<li>Gestión integral de ventas y facturación: Manejo completo del proceso de facturación de ventas, incluyendo remitos, control de stock, devoluciones y recepción/carga de pedidos.</li><li>Administración de medios de pago: Operación con cheques (al portador y cruzados), tarjetas de crédito y débito (POS), efectivo y realización de arqueos de caja.</li><li>Manejo de sistemas y herramientas: Uso del sistema de gestión Tango y dominio avanzado de Microsoft Office, especialmente Excel y PowerPoint.</li><li>Atención al cliente y asesoramiento comercial: Venta y recomendación de productos técnicos, electrodos, discos abrasivos, ropa de seguridad, máquinas de soldar, equipos de medición y control, entre otros.</li><li>Habilidades comerciales destacadas: Alta capacidad de persuasión y negociación para lograr cierres efectivos y fortalecer la relación con el cliente.</li>`, en: `<li>Comprehensive sales and invoicing management: Full handling of the sales invoicing process, including delivery notes, stock control, returns, and order reception/entry.</li><li>Payment methods administration: Operation with checks (bearer and crossed), credit and debit cards (POS), cash, and performing cash balancing.</li><li>Systems and tools management: Use of the Tango management system and advanced proficiency in Microsoft Office, especially Excel and PowerPoint.</li><li>Customer service and commercial advice: Sales and recommendation of technical products, electrodes, abrasive discs, safety clothing, welding machines, measurement and control equipment, among others.</li><li>Outstanding commercial skills: High capacity for persuasion and negotiation to achieve effective closings and strengthen the client relationship.</li>` }
    }, 
    { 
        id: 12, 
        date: { es: "Feb 2009 - Dic 2009", en: "Feb 2009 - Dec 2009" }, 
        title: { es: "Customer Services Representative", en: "Customer Services Representative" }, 
        company: "UBICAR ARGENTINA", 
        tags: ["Communication", "Soft Skills"],
        description: { es: `<li>Atención al cliente especializada: Representación directa ante usuarios de sistemas de rastreo satelital (radiofrecuencia y GPS), brindando soporte técnico y comercial.</li><li>Coordinación operativa: Asignación de turnos para instalación de dispositivos y seguimiento de solicitudes de servicio técnico.</li><li>Verificación de funcionamiento: Chequeo remoto y diagnóstico del estado del sistema de rastreo ante requerimientos del cliente.</li><li>Soporte en back office: Configuración y administración de cuentas personales de clientes, actualización de datos y resolución de incidencias administrativas.</li><li>Comunicación clara y efectiva: Interacción fluida con usuarios, adaptando la comunicación técnica a distintos niveles de conocimiento para garantizar una experiencia satisfactoria.</li>`, en: `<li>Specialized customer service: Direct representation to users of satellite tracking systems (radiofrequency and GPS), providing technical and commercial support.</li><li>Operational coordination: Assignment of shifts for device installation and monitoring of technical service requests.</li><li>Functionality verification: Remote checking and diagnosis of the tracking system's status upon client request.</li><li>Back office support: Configuration and administration of clients' personal accounts, data updates, and resolution of administrative incidents.</li><li>Clear and effective communication: Fluid interaction with users, adapting technical communication to different levels of knowledge to ensure a satisfactory experience.</li>` }
    }
];

export const educationData = [
    { 
        title: { es: "Postgraduate Degree, Ingeniería de Software", en: "Postgraduate Degree, Software Engineering" }, 
        school: "UAI - Universidad Abierta Interamericana", 
        date: "2025 - 2026",
        tags: ["Java", "Python", "SQL", "Git", "Terminal"]
    }, 
    { 
        title: { es: "Licenciatura, Gestión de TI", en: "Bachelor's Degree, IT Management" }, 
        school: "UADE", 
        date: "2020 - 2021",
        tags: ["SQL", "Excel"]
    }, 
    { 
        title: { es: "Profesorado, Sociología", en: "Teaching Degree, Sociology" }, 
        school: "Universidad de Buenos Aires", 
        date: "2014 - 2015",
        tags: []
    }, 
    { 
        title: { es: "Licenciatura, Sociología", en: "Bachelor's Degree, Sociology" }, 
        school: "Universidad de Buenos Aires", 
        date: "2007 - 2014",
        tags: []
    }, 
    { 
        title: { es: "Python Backend Engineer", en: "Python Backend Engineer" }, 
        school: "Platzi", 
        subtitle: { es: "Ciencias de la computación", en: "Computer Science" }, 
        date: "2022 - 2023",
        tags: ["Python", "Django", "Flask", "FastAPI", "SQL", "MySQL", "PostgreSQL", "SQLite", "Git", "Terminal", "HTML", "CSS"]
    }, 
    { 
        title: { es: "Data Analyst", en: "Data Analyst" }, 
        school: "Platzi", 
        subtitle: { es: "Ciencias de la computación", en: "Computer Science" }, 
        date: "2021 - 2022",
        tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "SQL", "Power BI", "Tableau", "Git", "Terminal", "Jupyter"]
    }, 
    { 
        title: { es: "Bachiller en Administración y Gestión de las Organizaciones", en: "High School Diploma in Business Administration and Management" }, 
        school: "Instituto Parroquial Fundador Don Francisco de Merlo", 
        subtitle: { es: "Administración y gestión de empresas, general", en: "Business Administration and Management, General" }, 
        date: "2003 - 2006",
        tags: ["Excel"]
    }
];

// Certifications with tags
export const certificationsData = [
    { name: "Buenas prácticas de desarrollo seguro para Back-end - Python", tags: ["Python", "Backend", "Hacking", "Ciberseguridad", "Pentesting", "Desarrollo Seguro"] },
    { name: "Onboarding - Security Guardians - Guardian", tags: ["Hacking ético", "Hacking", "Backend", "Python", "Pentesting", "Ciberseguridad"] },
    { name: "Seguridad en el Ciclo de Desarrollo - SSDLC", tags: ["Seguridad", "Desarrollo", "SSDLC", "Pentesting", "Ciberseguridad"] },
    { name: "GenAl for Champions", tags: ["LLM", "AI"] },
    { name: "Curso de N8N", tags: ["n8n", "Zapier"] },
    { name: "Introducción a Jira para gestión de proyectos con Kanban", tags: ["Jira", "Agile"] },
    { name: "Curso de Unit Testing en Python", tags: ["Python"] },
    { name: "Hacking con Python", tags: ["Python"] },
    { name: "Curso de Manejo de Datos Faltantes", tags: ["Python", "Pandas"] },
    { name: "Dataiku Core Designer", tags: ["Machine Learning"] },
    { name: "Enseñanza de inglés como lengua extranjera (TEFL)", tags: ["Soft Skills"] },
    { name: "Data Champions | BigQuery and LookML", tags: ["Google Cloud", "Looker"] },
    { name: "5 minutos al dia para mejorar tu Ingles", tags: ["Soft Skills"] },
    { name: "Curso de Análisis Exploratorio de Datos", tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"] },
    { name: "Curso de Estadistica Inferencial para Data Science", tags: ["Python", "Scikit-learn"] },
    { name: "Curso de Ética y Manejo de Datos para Data Science", tags: ["Python", "Soft Skills"] },
    { name: "Python TOTAL - Programador Avanzado", tags: ["Python"] },
    { name: "Curso Básico de Django", tags: ["Python", "Django"] },
    { name: "Curso de Desarrollo Backend", tags: ["Python", "Django", "Flask", "FastAPI"] },
    { name: "Curso de Django Intermedio", tags: ["Python", "Django"] },
    { name: "Curso de FastAPI: Modularización, Datos y Errores", tags: ["Python", "FastAPI"] },
    { name: "Curso de Flask", tags: ["Python", "Flask"] },
    { name: "Principios SOLID y Clean Code", tags: ["Java", "Kotlin"] },
    { name: "Curso Práctico de Python: Creación de un CRUD", tags: ["Python", "SQL"] },
    { name: "Curso de Complejidad Algoritmica con Python", tags: ["Python"] },
    { name: "Curso de Estructuras de Datos Lineales con Python", tags: ["Python"] },
    { name: "Curso de FastAPI: Fundamentos", tags: ["Python", "FastAPI"] },
    { name: "Curso de Pensamiento Computacional con Python", tags: ["Python"] },
    { name: "Curso de Python: PIP y Entornos Virtuales", tags: ["Python"] },
    { name: "Curso de Selenium con Python", tags: ["Python"] },
    { name: "Android Completo con Kotlin", tags: ["Kotlin"] },
    { name: "Curso de Fundamentos de Python", tags: ["Python"] },
    { name: "Curso de Python: Comprehensions, Funciones y Manejo de Errores", tags: ["Python"] },
    { name: "Curso de Kotlin desde Cero", tags: ["Kotlin"] },
    { name: "GOLANG: Curso profesional de Go", tags: ["Go"] },
    { name: "Problem Solving", tags: ["Python", "Java", "Kotlin"] },
    { name: "Curso de Webpack", tags: ["JavaScript"] },
    { name: "Diseño de interfaz (UI) con Figma", tags: ["Figma"] },
    { name: "Curso Básico de JavaScript", tags: ["JavaScript"] },
    { name: "Curso Práctico de Frontend Developer", tags: ["JavaScript", "HTML", "CSS", "Git"] },
    { name: "Curso de Asincronismo con JavaScript", tags: ["JavaScript"] },
    { name: "Curso de ECMAScript", tags: ["JavaScript"] },
    { name: "Curso de Frontend Developer", tags: ["JavaScript", "HTML", "CSS", "Git"] },
    { name: "Curso de NPM: Gestión de Paquetes", tags: ["JavaScript"] },
    { name: "Introducción a la Programación con Kotlin", tags: ["Kotlin"] },
    { name: "Nuevo Curso Gratis de Programación Básica", tags: ["Python"] },
    { name: "Curso Práctico de Product Owner", tags: ["Jira", "Notion", "Product Management", "Agile"] },
    { name: "Curso de Prework: Configuración de Entorno", tags: ["Python"] },
    { name: "Nuevo Curso de Pensamiento Lógico", tags: ["Python"] },
    { name: "Curso de Fundamentos de R", tags: ["R", "Shiny", "Dplyr", "Ggplot2"] },
    { name: "Data Analyst", tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "SQL", "Power BI", "Tableau"] },
    { name: "Curso de Digital Project Management", tags: ["Jira", "Notion", "Monday", "Product Management", "Agile"] },
    { name: "Curso de Manipulación y Transformación de Datos con Pandas y NumPy", tags: ["Python", "Pandas", "NumPy"] },
    { name: "Curso de PostgreSQL Aplicado a Ciencia de Datos", tags: ["SQL", "PostgreSQL"] },
    { name: "Curso de Visualización de Datos con Matplotlib y Seaborn", tags: ["Python", "Matplotlib", "Seaborn"] },
    { name: "Proyecto del #PlatziChallenge Datacademy 2022", tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"] },
    { name: "Curso Práctico de SQL", tags: ["SQL"] },
    { name: "Cómo y Por Qué Aprender Data Science", tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"] },
    { name: "Datacademy", tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"] },
    { name: "Curso de Análisis de Datos con Power BI", tags: ["Power BI"] },
    { name: "Curso de Configuración Profesional de Entorno de Trabajo para Ciencia de Datos", tags: ["Python", "Jupyter"] },
    { name: "Curso de Cómo Dar y Recibir Feedback", tags: ["Soft Skills", "Communication", "Leadership"] },
    { name: "Curso de Funciones Matemáticas para Data Science", tags: ["Python", "NumPy"] },
    { name: "Curso de PostgreSQL", tags: ["SQL", "PostgreSQL"] },
    { name: "Curso sobre la Neurociencia del Feedback", tags: ["Soft Skills", "Leadership"] },
    { name: "Curso de Programación Orientada a Objetos: POO", tags: ["Python", "Java", "Kotlin"] },
    { name: "Curso Fundamentos de Product Management", tags: ["Jira", "Notion", "Product Management"] },
    { name: "Curso de Filosofía para Managers", tags: ["Soft Skills", "Leadership"] },
    { name: "Curso de Herramientas para el Crecimiento Personal", tags: ["Soft Skills"] },
    { name: "Curso de Historia de Bitcoin y Criptomonedas", tags: ["Blockchain"] },
    { name: "Curso de Motivación para Equipos de Trabajo", tags: ["Soft Skills", "Leadership"] },
    { name: "Curso para Desbloquear tu Creatividad", tags: ["Soft Skills"] },
    { name: "Learning Path Shipping", tags: ["Jira", "Notion", "Product Management", "Agile"] },
    { name: "Curso Profesional de Python", tags: ["Python"] },
    { name: "Curso de Google Data Studio", tags: ["Looker Studio"] },
    { name: "Python Challenge", tags: ["Python"] },
    { name: "Curso de Business Intelligence: Utilidad y Áreas de Oportunidad", tags: ["Power BI", "Tableau"] },
    { name: "Curso de Excel Básico", tags: ["Excel"] },
    { name: "Curso de Fundamentos de Bases de Datos", tags: ["SQL"] },
    { name: "Curso de Introducción a Business Intelligence con Power BI", tags: ["Power BI"] },
    { name: "Curso de Introduccion al Algebra Lineal: Vectores", tags: ["Python", "NumPy"] },
    { name: "Curso de Principios de Visualización de Datos para Business Intelligence", tags: ["Power BI", "Tableau"] },
    { name: "Curso de Tableau: Visualización de Datos y Storytelling", tags: ["Tableau"] },
    { name: "Curso Práctico de Regresión Lineal con Python", tags: ["Python", "Scikit-learn"] },
    { name: "Curso de Entorno de Trabajo para Ciencia de Datos", tags: ["Python", "Jupyter"] },
    { name: "Curso de Fundamentos de Álgebra Lineal con Python", tags: ["Python", "NumPy"] },
    { name: "Curso de Google Suite", tags: ["Google Suite"] },
    { name: "Curso de Inglés para Principiantes", tags: ["Soft Skills"] },
    { name: "Curso de Matemáticas para Data Science: Cálculo Básico", tags: ["Python", "NumPy"] },
    { name: "Curso de Matemáticas para Data Science: Estadística Descriptiva", tags: ["Python", "Pandas", "NumPy"] },
    { name: "Curso de Matemáticas para Data Science: Probabilidad", tags: ["Python", "NumPy"] },
    { name: "Curso de Python Intermedio", tags: ["Python"] },
    { name: "Taller de Inglés para Principiantes", tags: ["Soft Skills"] },
    { name: "Curso Profesional de Git y GitHub", tags: ["Git", "Terminal"] },
    { name: "Curso de Comunicación Efectiva", tags: ["Soft Skills", "Communication"] },
    { name: "Curso de Fundamentos de Matemáticas", tags: ["Python"] },
    { name: "Curso de Gestión Efectiva del Tiempo", tags: ["Soft Skills"] },
    { name: "Curso de Inteligencia Emocional", tags: ["Soft Skills", "Leadership"] },
    { name: "Curso de Introducción a la Terminal y Línea de Comandos", tags: ["Terminal"] },
    { name: "Curso Básico de Python", tags: ["Python"] },
    { name: "Curso de Análisis de Negocios para Ciencia de Datos", tags: ["Python", "Pandas"] },
    { name: "Curso de Estrategias para Aprender Inglés Online", tags: ["Soft Skills"] },
    { name: "Data Explorer", tags: ["Python", "Pandas"] },
    { name: "MicroStrategy", tags: ["MicroStrategy"] },
    { name: "Looker", tags: ["Looker"] },
    { name: "SQL", tags: ["SQL"] },
    { name: "Tableau", tags: ["Tableau"] },
    { name: "Modelos logísticos para e-commerce", tags: ["Python", "Scikit-learn"] },
    { name: "SQL Foundmentals", tags: ["SQL"] }
];

// Legacy certifications array for backward compatibility
export const certifications = certificationsData.map(cert => cert.name);

export const translations = { job_title: { es: "Data & Analytics Technical Leader en Mercado Libre", en: "Data & Analytics Technical Leader at Mercado Libre" }, contact_title: { es: "Contacto", en: "Contact" }, download_btn: { es: "Descargar CV", en: "Download CV" }, stack_title: { es: "Stack Tecnológico", en: "Tech Stack" }, stack_backend: { es: "Backend & Datos", en: "Backend & Data" }, stack_ml: { es: "Machine Learning", en: "Machine Learning" }, stack_ai: { es: "IA & Automatización", en: "AI & Automation" }, stack_bi: { es: "Business Intelligence", en: "Business Intelligence" }, stack_productivity: { es: "Productividad", en: "Productivity" }, education_title: { es: "Educación", en: "Education" }, cert_lang_title: { es: "Certificaciones e Idiomas", en: "Certifications & Languages" }, languages_title: { es: "Idiomas", en: "Languages" }, lang_es: { es: "Español (Nativo)", en: "Spanish (Native)" }, lang_en: { es: "Inglés (C1 - Avanzado)", en: "English (C1 - Advanced)" }, cert_title: { es: "Formación Complementaria", en: "Complementary Training" }, about_title: { es: "Sobre mí", en: "About Me" }, about_text: { es: `Líder técnico con más de 6 años de experiencia en Mercado Libre, enfocado en Data & Analytics. Apasionado por liderar equipos de alto rendimiento para resolver desafíos complejos de negocio mediante la innovación y la tecnología. Experto en alinear estrategias de datos con objetivos corporativos para impulsar la eficiencia y el crecimiento. Mi objetivo es continuar democratizando el comercio y los servicios financieros en América Latina, transformando la vida de millones de personas.`, en: `Technical leader with over 6 years of experience at Mercado Libre, focused on Data & Analytics. Passionate about leading high-performance teams to solve complex business challenges through innovation and technology. Expert in aligning data strategies with corporate objectives to drive efficiency and growth. My goal is to continue democratizing commerce and financial services in Latin America, transforming the lives of millions.` }, projects_title: { es: "Proyectos Destacados", en: "Featured Projects" }, experience_title: { es: "Experiencia Profesional", en: "Professional Experience" }, view_repo: { es: "Ver Repositorio", en: "View Repository" }, footer_design: { es: "Diseñado con", en: "Designed with" }, footer_location: { es: "en Buenos Aires", en: "in Buenos Aires" }, calendly_btn: { es: "Agenda un espacio conmigo", en: "Schedule time with me" }, see_more: { es: "Ver más", en: "See more" }, terminal: { welcome: { es: 'Bienvenido a mi CV interactivo. Escribe "help" para ver la lista de comandos.', en: 'Welcome to my interactive CV. Type "help" to see the list of commands.' }, help: { es: 'Comandos disponibles:\n- about\n- experience\n- education\n- projects [--tag <tecnología>]\n- contact\n- neofetch\n- matrix\n- clear\n- gui (volver a la vista normal)', en: 'Available commands:\n- about\n- experience\n- education\n- projects [--tag <technology>]\n- contact\n- neofetch\n- matrix\n- clear\n- gui (return to normal view)' }, tag_error: { es: 'Error: Debes especificar una tecnología después de --tag.', en: 'Error: You must specify a technology after --tag.' }, projects_with_tag: { es: '--- Proyectos con la tecnología: {tag} ---', en: '--- Projects with technology: {tag} ---' }, projects_all: { es: '--- Proyectos Destacados ---', en: '--- Featured Projects ---' }, projects_not_found: { es: 'No se encontraron proyectos para esa tecnología.', en: 'No projects found for that technology.' }, experience_header: { es: '--- Experiencia Profesional ---', en: '--- Professional Experience ---' }, contact_details: { es: '- Ubicación: Buenos Aires, Argentina\n- Teléfono: +54 9 11 27475569\n- Email: gobeamariano@gmail.com', en: '- Location: Buenos Aires, Argentina\n- Phone: +54 9 11 27475569\n- Email: gobeamariano@gmail.com' }, command_not_found: { es: 'bash: command not found: {command}', en: 'bash: command not found: {command}' }, education_header: { es: '--- Educación ---', en: '--- Education ---' } } };
export const mgaLogo = [
    'MMMMMMM        MMMMMMMM    GGGGGGGG   ',
    'MMMMMMMM      MMMMMMMMM   GGGGGGGGGG  ',
    'MMMMMMMMM    MMMMMMMMMM   GGG         ',
    'MMMM  MMMMMMMMMMM  MMMM   GGG  GGGGG  ',
    'MMMM   MMMMMMMMM   MMMM   GGG    GGG  ',
    'MMMM    MMMMMMM    MMMM   GGGGGGGGGG  ',
    'MMMM     MMMMM     MMMM    GGGGGGGG   ',
    'MMMM      MMM      MMMM   ----------  ',
    'MMMM       M       MMMM    AAAAAAAAA  ',
    'MMMM               MMMM   AAAAAAAAAAA ',
    'MMMM               MMMM   AAA     AAA ',
    'MMMM               MMMM   AAAAAAAAAAA ',
    'MMMM               MMMM   AAAAAAAAAAA ',
    'MMMM               MMMM   AAA     AAA ',
    'MMMM               MMMM   AAA     AAA '
];
export const mgaLogo2 = [
    '██████╗╗      ██████╗╗  ██████████╗╗      ██████████╗╗     ',
    '██████╗╗      ██████╗╗  ██████████╗╗      ██████████╗╗     ',
    '████████╗╗  ████████║║████╔╔══════╝╝  ████╔╔════████╗╗     ',
    '████████╗╗  ████████║║████╔╔══════╝╝  ████╔╔════████╗╗     ',
    '████╔╔████████╔╔████║║████║║    ██████╗╗████████████████║║ ',
    '████╔╔████████╔╔████║║████║║    ██████╗╗████████████████║║ ',
    '████║║╚╚████╔╔╝╝████║║████║║      ████║║████╔╔════████╗╗   ',
    '████║║╚╚████╔╔╝╝████║║████║║      ████║║████╔╔════████╗╗   ',
    '████║║  ╚╚══╝╝  ████║║╚╚████████████╔╔╝╝████║║    ████║║   ',
    '████║║  ╚╚══╝╝  ████║║╚╚████████████╔╔╝╝████║║    ████║║   ',
    '╚╚══╝╝          ╚╚══╝╝  ╚╚══════════╝╝  ╚╚══╝╝    ╚╚══╝╝   ',
    '╚╚══╝╝          ╚╚══╝╝  ╚╚══════════╝╝  ╚╚══╝╝    ╚╚══╝╝   '
];