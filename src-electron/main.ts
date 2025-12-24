import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 获取当前文件的目录名
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        title: '今日诗词',
        icon: join(__dirname, '../public/logo.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            webviewTag: true,
        },
        show: false, // 先不显示窗口
        frame: true,
        autoHideMenuBar: true,
        backgroundColor: '#ffffff'
    });

    // 加载应用
    const startUrl = process.env.VITE_DEV_SERVER_URL || `file://${join(__dirname, '../dist/index.html')}`;
    
    mainWindow.loadURL(startUrl).catch(err => {
        console.error('加载应用失败:', err);
    });

    // 当窗口准备就绪时显示
    mainWindow.once('ready-to-show', () => {
        if (mainWindow) {
            mainWindow.show();
            // 开发模式下自动打开开发者工具
            if (process.env.VITE_DEV_SERVER_URL) {
                mainWindow.webContents.openDevTools();
            }
        }
    });

    // 窗口关闭时
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 处理窗口大小变化
    mainWindow.on('resize', () => {
        // 可以在这里添加窗口大小变化的处理逻辑
    });

    // 处理渲染进程崩溃
    mainWindow.webContents.on('render-process-gone', (event, details) => {
        console.error('渲染进程崩溃:', details);
    });

}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
