# Mariano Gobea Alcoba - Interactive CV

A modern, interactive CV/portfolio website showcasing my experience as a Data & Analytics Technical Leader at Mercado Libre.

## 🚀 Features

- **Interactive Terminal Mode**: Command-line interface with custom commands
- **Matrix Effect**: Visual effect inspired by The Matrix
- **Multi-language Support**: Spanish and English
- **Theme Switching**: Dark, Light, and Terminal themes
- **Responsive Design**: Optimized for all devices
- **PDF Export**: Download CV as PDF
- **Interactive Timeline**: Click to view detailed experience
- **Project Filtering**: Filter projects by technology
- **Analytics Integration**: Google Analytics tracking

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **PDF Generation**: html2canvas + jsPDF
- **Analytics**: Google Analytics
- **Scheduling**: Calendly Integration

## 📁 Project Structure

```
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── main.css        # Main styles
│   │   ├── themes.css      # Theme-specific styles
│   │   ├── terminal.css    # Terminal mode styles
│   │   └── intro.css       # Introduction animation styles
│   ├── js/
│   │   ├── main.js         # Main application logic
│   │   ├── data.js         # Data configuration
│   │   ├── terminal.js     # Terminal functionality
│   │   ├── themes.js       # Theme management
│   │   ├── intro.js        # Introduction animation
│   │   ├── pdf.js          # PDF generation
│   │   └── utils.js        # Utility functions
│   └── images/
│       └── profile.png     # Profile image
├── package.json
└── README.md
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

- **Dark Mode**: Default theme with dark background
- **Light Mode**: Clean light theme
- **Terminal Mode**: Command-line interface experience

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔧 Customization

### Adding New Projects
Edit `assets/js/data.js` and add to the `projectsData` array.

### Adding New Experience
Edit `assets/js/data.js` and add to the `experienceData` array.

### Modifying Tech Stack
Edit `assets/js/data.js` and modify the `techStackData` object.

## 📊 Analytics

The website includes Google Analytics tracking for:
- Page views
- Social media clicks
- Theme changes
- Language switches

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Mariano Gobea Alcoba**
- LinkedIn: [Mariano Gobea Alcoba](https://www.linkedin.com/in/mariano-gobea-alcoba/)
- GitHub: [Mgobeaalcoba](https://github.com/Mgobeaalcoba)
- Twitter: [@MGobeaAlcoba](https://x.com/MGobeaAlcoba)

## 🤝 Contributing

This is a personal portfolio website, but suggestions and improvements are welcome!

---

*Built with ❤️ in Buenos Aires, Argentina* 