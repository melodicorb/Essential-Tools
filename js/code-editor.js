/**
 * Code Editor Tool - JavaScript functionality
 * Write, edit, and run code in multiple programming languages
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const codeEditor = document.getElementById('code-editor');
    const languageSelect = document.getElementById('language-select');
    const themeSelect = document.getElementById('theme-select');
    const runBtn = document.getElementById('run-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const output = document.getElementById('output');
    
    // CodeMirror instance
    let editor;
    
    // Initialize the code editor tool
    function initCodeEditor() {
        // Initialize CodeMirror
        editor = CodeMirror(codeEditor, {
            mode: 'javascript',
            theme: 'default',
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            tabSize: 2,
            indentWithTabs: false,
            lineWrapping: true,
            extraKeys: {
                'Ctrl-Space': 'autocomplete'
            }
        });
        
        // Set default content
        const defaultCode = getDefaultCode('javascript');
        editor.setValue(defaultCode);
        
        // Set up event listeners
        setupEventListeners();
        
        // Load saved code if available
        loadSavedCode();
        
        // Set current year in footer
        if (document.getElementById('current-year')) {
            document.getElementById('current-year').textContent = new Date().getFullYear();
        }
        
        // Initialize 3D icon
        if (typeof Tool3DIcon !== 'undefined' && Tool3DIcon.init) {
            const container = document.querySelector('.tool-3d-container');
            if (container) {
                Tool3DIcon.init(container, 'code-editor');
            }
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Language change
        languageSelect.addEventListener('change', function() {
            const language = languageSelect.value;
            editor.setOption('mode', language);
            
            // Set default code for the selected language if editor is empty
            if (editor.getValue().trim() === '') {
                editor.setValue(getDefaultCode(language));
            }
            
            // Save the selected language
            localStorage.setItem('code-editor-language', language);
        });
        
        // Theme change
        themeSelect.addEventListener('change', function() {
            const theme = themeSelect.value;
            editor.setOption('theme', theme);
            
            // Save the selected theme
            localStorage.setItem('code-editor-theme', theme);
        });
        
        // Run code
        runBtn.addEventListener('click', function() {
            runCode();
        });
        
        // Clear editor
        clearBtn.addEventListener('click', function() {
            const language = languageSelect.value;
            editor.setValue(getDefaultCode(language));
            output.innerHTML = '';
            editor.focus();
        });
        
        // Copy code
        copyBtn.addEventListener('click', function() {
            const code = editor.getValue();
            navigator.clipboard.writeText(code).then(function() {
                // Show feedback
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            });
        });
        
        // Auto-save code as user types
        editor.on('change', function() {
            localStorage.setItem('code-editor-content', editor.getValue());
        });
        
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    // Run the code
    function runCode() {
        const code = editor.getValue();
        const language = languageSelect.value;
        
        // Clear previous output
        output.innerHTML = '';
        
        try {
            if (language === 'javascript') {
                // Create a sandbox iframe for JavaScript execution
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                // Capture console.log output
                const originalConsoleLog = iframe.contentWindow.console.log;
                iframe.contentWindow.console.log = function() {
                    const args = Array.from(arguments);
                    const logLine = document.createElement('div');
                    logLine.textContent = args.join(' ');
                    output.appendChild(logLine);
                    originalConsoleLog.apply(iframe.contentWindow.console, args);
                };
                
                // Execute the code
                try {
                    const result = iframe.contentWindow.eval(code);
                    if (result !== undefined) {
                        const resultLine = document.createElement('div');
                        resultLine.textContent = '=> ' + result;
                        resultLine.classList.add('text-green-600');
                        output.appendChild(resultLine);
                    }
                } catch (error) {
                    const errorLine = document.createElement('div');
                    errorLine.textContent = 'Error: ' + error.message;
                    errorLine.classList.add('text-red-600');
                    output.appendChild(errorLine);
                }
                
                // Clean up
                document.body.removeChild(iframe);
            } else if (language === 'htmlmixed') {
                // For HTML, render the code in the output
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                output.innerHTML = '';
                output.appendChild(iframe);
                
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(code);
                iframeDoc.close();
            } else if (language === 'css') {
                // For CSS, show a preview with some default HTML
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                output.innerHTML = '';
                output.appendChild(iframe);
                
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(`
                    <html>
                        <head>
                            <style>${code}</style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>CSS Preview</h1>
                                <p>This is a paragraph to demonstrate your CSS.</p>
                                <button>Button Element</button>
                                <ul>
                                    <li>List Item 1</li>
                                    <li>List Item 2</li>
                                    <li>List Item 3</li>
                                </ul>
                            </div>
                        </body>
                    </html>
                `);
                iframeDoc.close();
            }
        } catch (error) {
            output.innerHTML = `<div class="text-red-600">Error: ${error.message}</div>`;
        }
    }
    
    // Get default code for each language
    function getDefaultCode(language) {
        switch (language) {
            case 'javascript':
                return '// JavaScript Code Example\n\nconsole.log("Hello, world!");\n\n// Function example\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Developer"));';
            case 'htmlmixed':
                return '<!DOCTYPE html>\n<html>\n<head>\n  <title>HTML Example</title>\n  <style>\n    body {\n      font-family: Arial, sans-serif;\n      margin: 20px;\n    }\n    h1 {\n      color: #3B82F6;\n    }\n  </style>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>This is an HTML example.</p>\n</body>\n</html>';
            case 'css':
                return '/* CSS Example */\n\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f5f5f5;\n  margin: 0;\n  padding: 20px;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  background-color: white;\n  padding: 20px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n\nh1 {\n  color: #3B82F6;\n}\n\nbutton {\n  background-color: #10B981;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #059669;\n}';
            default:
                return '';
        }
    }
    
    // Load saved code from localStorage
    function loadSavedCode() {
        // Load saved language
        const savedLanguage = localStorage.getItem('code-editor-language');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
            editor.setOption('mode', savedLanguage);
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('code-editor-theme');
        if (savedTheme) {
            themeSelect.value = savedTheme;
            editor.setOption('theme', savedTheme);
        }
        
        // Load saved content
        const savedContent = localStorage.getItem('code-editor-content');
        if (savedContent) {
            editor.setValue(savedContent);
        }
    }
    
    // Initialize the tool
    initCodeEditor();
});