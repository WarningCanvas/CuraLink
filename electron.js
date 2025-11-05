const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { initializeDatabase, getServices } = require('./src/database');

let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'default',
        show: false,
        backgroundColor: '#1a202c'
    });

    // Load the app
    const startUrl = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startUrl);

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });   

    // Open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC Handlers for database operations
function setupIpcHandlers() {
    // Template handlers
    ipcMain.handle('db-templates', async (event, action, data) => {
        try {
            const services = getServices();

            switch (action) {
                case 'getAll':
                    return await services.getAllTemplates();
                case 'create':
                    return await services.createTemplate(data);
                case 'update':
                    return await services.updateTemplate(data.id, data);
                case 'delete':
                    return await services.deleteTemplate(data);
                default:
                    throw new Error(`Unknown template action: ${action}`);
            }
        } catch (error) {
            console.error('Template IPC error:', error);
            throw error;
        }
    });

    // Contact handlers
    ipcMain.handle('db-contacts', async (event, action, data) => {
        try {
            const services = getServices();

            switch (action) {
                case 'getAll':
                    return await services.getAllContacts();
                case 'create':
                    return await services.createContact(data);
                case 'update':
                    return await services.updateContact(data.id, data);
                case 'delete':
                    return await services.deleteContact(data);
                default:
                    throw new Error(`Unknown contact action: ${action}`);
            }
        } catch (error) {
            console.error('Contact IPC error:', error);
            throw error;
        }
    });
}

// App event listeners
app.whenReady().then(async () => {
    try {
        // Initialize database
        console.log('🚀 Initializing CuraLink database...');
        const services = await initializeDatabase();

        // Test database connection
        const stats = await services.getStats();
        console.log('✅ Database initialized successfully!');
        console.log('📊 Database stats:', stats);

        // Setup IPC handlers
        setupIpcHandlers();
        console.log('📡 IPC handlers registered');
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        console.error('Stack trace:', error.stack);
    }

    createWindow();

    // macOS specific - recreate window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
    });
});

// Create application menu
const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit CuraLink',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));