# Notes App

A modern, feature-rich note-taking application built with vanilla JavaScript. Create, organize, and manage your notes with a clean, responsive interface that works seamlessly across desktop, tablet, and mobile devices.

## Features

### Core Functionality
- **Rich Text Editor** - Format your notes with bold, italic, underline, and lists
- **Smart Organization** - Organize notes with tags and categories
- **Search & Filter** - Quickly find notes by title, content, or tags
- **Archive System** - Archive notes to keep your workspace clean
- **Share Notes** - Generate shareable links for read-only note access
- **Import/Export** - Backup and restore notes via JSON files

### User Experience
- **Responsive Design** - Optimized layouts for desktop, tablet, and mobile
- **Theme Customization** - Light, dark, and system theme options
- **Font Selection** - Choose from Inter, Noto Serif, or Source Code Pro
- **Keyboard Shortcuts** - Save notes with Ctrl/Cmd+S, cancel with Escape
- **Auto-save** - Notes persist in browser localStorage
- **Toast Notifications** - Clear feedback for all actions

### Technical Highlights
- **Vanilla JavaScript** - No framework dependencies
- **Component-Based Architecture** - Modular, maintainable code structure
- **State Management** - Centralized store with localStorage persistence
- **Event Delegation** - Efficient event handling
- **Sanitized HTML** - Safe rich text content rendering

## Project Structure

```
note/
├── index.html              # Main entry point
├── assets/
│   ├── fonts/             # Inter, Noto Serif, Source Code Pro
│   └── images/            # Icons and logos
├── css/
│   └── main.css           # Compiled styles
├── sass/                  # SCSS source files
│   ├── main.scss
│   ├── _variable.scss
│   ├── _themes.scss
│   ├── _layout.scss
│   ├── _sidebar.scss
│   ├── _notes-list.scss
│   ├── _note-view.scss
│   ├── _buttons.scss
│   ├── _bottom-nav.scss
│   ├── _settings.scss
│   ├── _modal.scss
│   ├── _toast.scss
│   ├── _search-view.scss
│   └── _share-view.scss
└── js/
    ├── app.js             # Application initialization
    ├── render.js          # Main render logic
    ├── events.js          # Event handlers
    ├── themes.js          # Theme management
    ├── components/        # UI components
    │   ├── Button.js
    │   ├── Modal.js
    │   ├── NoteCard.js
    │   ├── NoteList.js
    │   ├── NoteView.js
    │   ├── SearchBar.js
    │   ├── SearchView.js
    │   ├── Settings.js
    │   ├── SettingsView.js
    │   ├── ShareView.js
    │   ├── Sidebar.js
    │   ├── Toast.js
    │   └── BottomNav.js
    ├── state/
    │   └── store.js       # State management & localStorage
    ├── features/
    │   ├── richtext.js    # Rich text editor functionality
    │   └── exportImport.js # JSON import/export
    ├── utils/
    │   ├── clipboard.js   # Clipboard operations
    │   ├── helpers.js     # Utility functions
    │   └── text.js        # Text processing
    └── data/
        └── notes.js       # Sample notes data
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (for ES6 module support)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd note
```

2. Start a local web server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

### Deployment URL
https://pen-it-orpin.vercel.app/

https://pen-ink.netlify.app/

### Development

If you want to modify styles, you'll need to compile SCSS:

1. Install Sass:
```bash
npm install -g sass
```

2. Watch for changes:
```bash
sass --watch sass/main.scss:css/main.css
```

Or compile once:
```bash
sass sass/main.scss css/main.css
```

## Usage

### Creating Notes
- Click the "Create New Note" button (desktop) or the floating action button (mobile)
- Enter a title and content
- Add tags separated by commas (e.g., "Work, Planning")
- Select a category from the dropdown or leave as "Uncategorized"
- Click "Save Note" or press Ctrl/Cmd+S

### Organizing Notes
- **Tags**: Click tags in the sidebar to filter notes
- **Categories**: Create categories and assign them to notes for better organization
- **Archive**: Archive notes you don't need immediate access to
- **Search**: Use the search bar to find notes by title, content, or tags

### Rich Text Formatting
- **Bold**: Ctrl/Cmd+B or use toolbar button
- **Italic**: Ctrl/Cmd+I or use toolbar button
- **Underline**: Ctrl/Cmd+U or use toolbar button
- **Lists**: Use toolbar buttons for bulleted or numbered lists

### Sharing Notes
1. Open a note
2. Click the "Share Link" button
3. Share the generated URL with others
4. Recipients can view the note in read-only mode

### Import/Export
- **Export**: Click "Export Notes" to download all notes as JSON
- **Import**: Click "Import from JSON" to restore notes from a backup file

### Keyboard Shortcuts
- `Ctrl/Cmd+S` - Save current note
- `Escape` - Cancel editing and return to notes list
- `Ctrl/Cmd+B` - Bold text
- `Ctrl/Cmd+I` - Italic text
- `Ctrl/Cmd+U` - Underline text

## Data Storage

All data is stored locally in your browser using localStorage:
- **notes_app_state** - All notes data
- **notes_app_settings** - User preferences (theme, font)
- **notes_app_categories** - Custom categories

No data is sent to external servers. Your notes remain private and local to your device.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires support for:
- ES6 Modules
- localStorage
- CSS Grid & Flexbox
- contenteditable
- DOMParser

## Responsive Breakpoints

- **Desktop**: ≥1024px - Full three-column layout
- **Tablet**: 768px-1023px - Collapsible sidebar, two-column layout
- **Mobile**: <768px - Single column, bottom navigation

## Customization

### Adding New Themes
Edit `js/themes.js` and `sass/_themes.scss` to add custom color schemes.

### Modifying Fonts
Add font files to `assets/fonts/` and update the font map in `js/themes.js`.

### Styling
All styles are in the `sass/` directory. Modify SCSS files and recompile to `css/main.css`.

## Security

- **HTML Sanitization**: Rich text content is sanitized to prevent XSS attacks
- **Allowed Tags**: Only safe HTML tags (B, STRONG, I, EM, U, UL, OL, LI, P, BR) are permitted
- **No Attributes**: HTML attributes are stripped to prevent malicious code injection
- **Local Storage Only**: No external API calls or data transmission

## Known Limitations

- Notes are stored locally - clearing browser data will delete all notes
- Share links only work if the recipient has access to the same application instance
- No cloud sync or multi-device support
- Maximum localStorage size varies by browser (typically 5-10MB)

## Troubleshooting

### Notes not saving
- Check browser console for errors
- Verify localStorage is enabled in browser settings
- Check available storage space

### Styles not loading
- Ensure `css/main.css` exists and is compiled from SCSS
- Check browser console for 404 errors
- Clear browser cache

### Module errors
- Ensure you're using a web server (not file:// protocol)
- Check that all JavaScript files use correct relative paths

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across devices
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Icons and design inspired by modern note-taking applications
- Built with vanilla JavaScript to demonstrate framework-free development
- Responsive design patterns for optimal cross-device experience

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

## Preview

![alt text](assets/images/source-code-pro/preview.jpg)

**Built with ❤️ using Vanilla JavaScript**
