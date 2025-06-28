# Mariano Gobea Alcoba - Interactive CV & Consulting Portfolio

A modern, interactive CV/portfolio website with integrated consulting services page, showcasing experience as a Data & Analytics Technical Leader at Mercado Libre and professional consulting services.

## 🚀 Features

### 🎯 Core Features
- **Interactive Terminal Mode**: Command-line interface with custom commands
- **Matrix Effect**: Visual effect inspired by The Matrix
- **Multi-language Support**: Complete Spanish and English translation system
- **Theme Switching**: Dark, Light, and Terminal themes
- **Responsive Design**: Optimized for all devices
- **PDF Export**: Download CV as PDF
- **Interactive Timeline**: Click to view detailed experience
- **Project Filtering**: Filter projects by technology
- **Analytics Integration**: Google Analytics tracking

### 🆕 New Consulting Features
- **Dedicated Consulting Page**: Complete services showcase (`consulting.html`)
- **Interactive Service Packs**: Detailed modal presentations
- **Case Studies**: Real-world automation and AI examples
- **Process Visualization**: Step-by-step methodology
- **Bilingual Content**: Full ES/EN translation for all consulting content
- **Modal System**: Advanced modal interactions with multiple close methods
- **Integrated Navigation**: Seamless flow between CV and consulting pages

### 🎯 **Lead Generation System (NEW v2.1)**
- **Instant Pre-proposal Generation**: Interactive form to create custom PDF proposals
- **Real-time PDF Creation**: Using html2canvas + jsPDF for professional documents
- **Multi-channel Contact**: Automated WhatsApp and Email integration
- **Form Validation**: Real-time validation with visual feedback
- **Personalized Output**: Company-specific proposal documents
- **Conversion Optimization**: Streamlined 3-click process from interest to contact

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript ES6+ Modules
- **Styling**: Tailwind CSS + Custom CSS Modules
- **Icons**: Font Awesome
- **PDF Generation**: html2canvas + jsPDF
- **Form Processing**: Real-time validation and dynamic content generation
- **Contact Integration**: WhatsApp Web API + Email client automation
- **Analytics**: Google Analytics
- **Scheduling**: Calendly Integration
- **Architecture**: Modular ES6 with clean separation of concerns

## 📁 Project Structure

```
├── index.html              # Main CV page
├── consulting.html         # Consulting services page
├── assets/
│   ├── css/
│   │   ├── main.css        # Main styles and CSS variables
│   │   ├── consulting.css  # Consulting page specific styles
│   │   ├── components.css  # Reusable component styles
│   │   ├── themes.css      # Theme-specific styles
│   │   ├── terminal.css    # Terminal mode styles
│   │   ├── intro.css       # Introduction animation styles
│   │   ├── base.css        # Reset and base styles
│   │   └── styles.css      # Main CSS import file
│   ├── js/
│   │   ├── init.js         # Main initialization script
│   │   ├── consulting.js   # Consulting page functionality
│   │   ├── translations.js # Comprehensive ES/EN translations
│   │   ├── main.js         # Main application logic
│   │   ├── data.js         # CV and project data
│   │   ├── terminal.js     # Terminal functionality
│   │   ├── themes.js       # Theme management
│   │   ├── intro.js        # Introduction animation
│   │   ├── pdf.js          # PDF generation
│   │   ├── utils.js        # Utility functions
│   │   ├── config.js       # Configuration constants
│   │   └── app.js          # Application orchestrator
│   └── images/
│       ├── profile.png     # Profile image
│       ├── chatbot.jpg     # Consulting case study
│       ├── feedback.jpg    # AI analysis example
│       ├── ventas.jpg      # Sales dashboard example
│       └── inventario.jpg  # Inventory control example
├── package.json
├── README.md
├── CHANGELOG.md
├── SCAFFOLDING.md
└── LICENSE
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mgobeaalcoba/Mgobeaalcoba.github.io.git
   cd Mgobeaalcoba.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🌐 Site Navigation

### Main CV Page (`/index.html`)
- Complete interactive CV experience
- Technical skills and experience
- Project portfolio
- Terminal mode
- Multi-theme support

### Consulting Services (`/consulting.html`)
- Professional consulting services
- Service packages and pricing
- Real case studies and examples
- Process methodology
- Contact and scheduling

## 🎮 Terminal Commands

When in terminal mode, you can use these commands:

- `help` - Show available commands
- `about` - Display about information
- `experience` - Show work experience
- `education` - Show education history
- `projects [--tag <technology>]` - Show projects (optionally filtered)
- `contact` - Show contact information
- `neofetch` - Display system information
- `matrix` - Start matrix effect
- `clear` - Clear terminal
- `gui` - Return to normal view

## 🎨 Themes

- **Dark Mode**: Default theme with dark background and glass effects
- **Light Mode**: Clean light theme for better readability
- **Terminal Mode**: Full command-line interface experience

## 🌍 Internationalization

### Complete Bilingual Support
- **Spanish (ES)**: Default language
- **English (EN)**: Complete translation including:
  - CV content and sections
  - Consulting services and descriptions
  - Modal content and interactions
  - Terminal commands and responses
  - UI elements and navigation

### Features
- **Dynamic Switching**: No page reload required
- **Persistent Preferences**: Language saved in localStorage
- **Synchronized State**: Language consistent across both pages
- **Content Adaptation**: Dynamic typing effects and modal content

## 🔧 Consulting Page Features

### 🎯 **Lead Generation System**
- **"Crear Pre-propuesta Instantánea"**: Main CTA button
- **5-Field Form**: Name, Email, Company, Industry, Problem Description
- **Real-time PDF Generation**: Professional proposals using client data
- **Contact Options Modal**: WhatsApp + Email with pre-loaded messages
- **Form Validation**: Visual feedback and error handling
- **Mobile Optimized**: Touch-friendly interface with glass morphism effects

### Service Packages
- **Pack Starter**: Entry-level automation (USD 850)
- **Pack Crecimiento**: Automation + AI chatbot (USD 1,500)
- **Pack BI Express**: Business Intelligence dashboard (USD 1,200)

### Interactive Modals
- **Multi-close Support**: X button, click outside, Escape key
- **Dynamic Content**: Translated modal content
- **Responsive Design**: Mobile-optimized interactions

### Case Studies
- **Automation Examples**: Social media, reporting workflows
- **AI Applications**: Chatbots, sentiment analysis
- **BI Solutions**: Sales dashboards, inventory control

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** (1200px+): Full feature experience
- **Tablet** (768px - 1199px): Adapted layouts
- **Mobile** (< 768px): Touch-optimized interface

## 🔧 Customization

### Adding New Content

#### CV Projects
Edit `assets/js/data.js` and add to the `projectsData` array.

#### Work Experience
Edit `assets/js/data.js` and add to the `experienceData` array.

#### Consulting Services
Edit `assets/js/consulting.js` and `consulting.html` for new services.

#### Translations
Add new keys to `assets/js/translations.js` for both ES and EN.

### Technical Modifications

#### New Themes
1. Add CSS variables in `assets/css/main.css`
2. Update theme logic in `assets/js/themes.js`
3. Test across all pages and modes

#### New Features
1. Create modular JS file in `assets/js/`
2. Import in `assets/js/init.js`
3. Add corresponding CSS if needed
4. Update documentation

## 📊 Analytics & Tracking

- **Page Views**: Both CV and consulting pages
- **User Interactions**: Language switches, theme changes
- **Navigation Flow**: Cross-page user journey
- **Modal Engagement**: Service package interactions
- **Contact Events**: Lead generation tracking

## 🔒 Security & Performance

- **XSS Prevention**: Input sanitization and validation
- **CSP**: Content Security Policy implementation
- **HTTPS**: Secure connections
- **Optimized Assets**: Minified CSS/JS
- **Lazy Loading**: Optimized image loading
- **Caching**: Browser cache optimization

## 🚀 Deployment

### GitHub Pages
- **Automatic Deployment**: Push to main branch
- **Custom Domain**: Professional domain setup
- **HTTPS**: Automatic SSL certificate
- **CDN**: Global content delivery

### Performance Optimizations
- **Modular Loading**: ES6 modules for efficient loading
- **Code Splitting**: Separate concerns and lazy loading
- **Asset Optimization**: Compressed images and resources
- **Caching Strategy**: Optimized cache headers

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Mariano Gobea Alcoba**
- LinkedIn: [Mariano Gobea Alcoba](https://www.linkedin.com/in/mariano-gobea-alcoba/)
- GitHub: [Mgobeaalcoba](https://github.com/Mgobeaalcoba)
- Twitter: [@MGobeaAlcoba](https://x.com/MGobeaAlcoba)
- Consulting: [Schedule a consultation](https://calendly.com/mgobeaalcoba/consultoria-gratis)

## 🤝 Contributing

This is a personal portfolio and consulting website. Suggestions and improvements are welcome!

### Development Guidelines
- Follow ES6+ module standards
- Maintain translation consistency
- Test on all devices and browsers
- Update documentation for new features

## 🎯 Recent Updates (2025)

### Version 2.1 (Latest)
- ✅ **Lead Generation System**: Complete "Pre-propuesta Instantánea" functionality
- ✅ **PDF Generation Engine**: Real-time document creation with html2canvas + jsPDF
- ✅ **Multi-channel Contact**: WhatsApp + Email automation with personalized messages
- ✅ **Enhanced Form Processing**: Real-time validation and professional UX
- ✅ **Conversion Optimization**: 3-click process from interest to contact

### Version 2.0
- ✅ **Complete Consulting Page**: Full-featured services showcase
- ✅ **Expanded Translation System**: 600+ translation keys
- ✅ **Advanced Modal System**: Multiple interaction methods
- ✅ **Integrated Navigation**: Seamless multi-page experience
- ✅ **Mobile Optimization**: Enhanced touch interactions
- ✅ **Performance Improvements**: Optimized loading and rendering

---

*Built with ❤️ in Buenos Aires, Argentina | Professional Consulting Services Available* 