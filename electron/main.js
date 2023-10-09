const pdfjsLib = require("pdfjs-dist");
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const url = require('url');
const fs = require("fs")
const { spawn } = require('child_process');
const Store = require('electron-store');
const os = require('os');
const store = new Store();

const dbops = require('../database/dboperations')
const mc = require('./protoclients/messageclient')
let win = null;

const startChildProcess = () => {
    clipath = path.resolve(__dirname, '../grpcexec/pydist/cli/cli')
    let command = `./grpcexec/pydist/cli/cli`
    command = 'python3 ./helloworld.py'
    let args = [path.join(__dirname, 'helloworld.py')];
    args = []
    const child = spawn('./electron/grpcexec/pydist/cli/cli', [], { stdio: ['pipe', 'pipe', 'pipe'] } );
    
    
    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    child.on('error', (error) => {
        console.log(error)
        console.error(`Error: ${error}`);
    });
    
    child.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
}

const createWindow = () => {
    let startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.resolve(__dirname, '../appdist/index.html'),
        protocol: 'file:',
        slashes: true,
    });
    // startUrl = url.format({
    //     pathname: path.resolve(__dirname, '../appdist/index.html'),
    //     protocol: 'file:',
    //     slashes: true,
    // });
    const {width, height} = screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({
        resizable:false,
        maximizable:false,
        transparent:true,
        width,
        height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.setIcon(path.join(__dirname, '../assets/images/matrixtwo.jpg'));
    win.loadURL(startUrl);
    startChildProcess();
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
const readFile = (fileURL) => {
   const pathToFile = fileURL.replace("file:\\\\",'');
   const buff =  fs.readFileSync(pathToFile)
   return buff;
}
const getLocation = (l) => {
    return `${os.homedir()}/Downloads${l}`
}
const GetTextFromPDF = async (path, page) => {
    let doc = await pdfjsLib.getDocument(path).promise;
    let page1 = await doc.getPage(page);
    let content = await page1.getTextContent();
    let strings = content.items.map(function(item) {
        return item.str;
    });
    let words = [] 
    strings.forEach((string) => {
        myArray = string.split(" ");
        myArray.forEach((word) => {
            if(word != '')
                words.push(word)
        })
    })
    return words;
}
ipcMain.on('app-ipc', (event, arg) => {
    const { location } = arg;
    const bookLocation = getLocation(location)
    const buff = readFile(bookLocation)
    mc.unaryclient.GetServerResponse({message: 'hello sharath'}, (error, news) => {
      if (!error) {
        console.log('err --> ', error)
      }
    });
    store.set('lastlocation', location);
    win.webContents.send('pdf-blob', {'buffer': buff});
});
ipcMain.on('last-location', (event, arg) => {
    const ll = store.get('lastlocation');
    win.webContents.send('last-location-after', {lloptions: ll});
});
const addcommonwords = (commonwords) => {
    dbops.addcommonwords(commonwords)
    .then((_data) => {
        win.webContents.send('add-common-after', 'success');
    })
    .catch((err)=>{
        console.log(err)
    })
}
ipcMain.on('add-common', (event, arg) => {
    const { common } = arg;
    addcommonwords(common);
});

ipcMain.on('app-scan', (event, arg) => {

    const { location, page } = arg;
    const bookLocation = getLocation(location)
    console.log(location, page)
    mc.unaryclient.Scan({book:bookLocation, start:`${page}`, end:`${page}`}, (error, data) => {
        if (!error) {
              console.log('err --> ', error)
        }
        const freqdata = []
        const meaningMap = {}
        data.pairs&&data.pairs.forEach((pair) => {
            if(meaningMap[pair.word]){
                meaningMap[pair.word].push(pair.meaning)
            } else{
                meaningMap[pair.word] = []
                meaningMap[pair.word].push(pair.meaning)
            }
        })
        freqdata.sort(function(a, b){return a.freq - b.freq});
        win.webContents.send('app-scan', {'meaningMap': meaningMap});
    });
});
