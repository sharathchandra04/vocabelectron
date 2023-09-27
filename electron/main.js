const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const url = require('url');
const fs = require("fs")
const Store = require('electron-store');
const store = new Store();

const dbops = require('../database/dboperations')
const mc = require('./protoclients/messageclient')
let win = null;
const createWindow = () => {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.resolve(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
    });
    const {width, height} = screen.getPrimaryDisplay().workAreaSize
    console.log('__dirname ---> ', __dirname);

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
const pdfjsLib = require("pdfjs-dist");
const GetTextFromPDF = async (path, page) => {
    console.log(path, page);
    let doc = await pdfjsLib.getDocument(path).promise;
    let page1 = await doc.getPage(page);
    console.log(typeof page1)
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
    const buff = readFile(location)
    mc.unaryclient.GetServerResponse({message: 'hello sharath'}, (error, news) => {
      if (!error) {
        console.log('err --> ', error)
      }
        console.log(news);
    });
    console.log('location -----> ', location);
    store.set('lastlocation', location);
    win.webContents.send('pdf-blob', {'buffer': buff});
});
ipcMain.on('last-location', (event, arg) => {
    const ll = store.get('lastlocation');
    console.log('ll inside main --> ', ll);
    win.webContents.send('last-location-after', {lloptions: ll, randonm: Math.random() * (100 - 1) + 1});
});

const filterWords = (words) => {
    const filteredWords = {};
    words.forEach((word)=>{
        word = word.replace(/[^a-zA-Z0-9]/g,'');
        word = word.toLowerCase();
        word = word.replace(/ /g,"");
        if(word.length){
            filteredWords[word] = true;
        }
    })
    return Object.keys(filteredWords);
}
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
    GetTextFromPDF(location, page)
    .then( (words) => {
        let filteredWords = filterWords(words);
        // filteredWords = ['the', 'atone'];
        mc.unaryclient.GetWordFrequencies({words: filteredWords}, (error, data) => {
            if (!error) {
              console.log('err --> ', error)
            }
            console.log('frequencies -> ', data)
            const freqdata = []
            data.frequencies.forEach((fre, index) => {
                console.log(fre, filteredWords[index])
                const freqMap = {
                    "word": filteredWords[index], 
                    "freq": Math.round(fre * 10) / 10
                };
                freqdata.push(freqMap);
            })

            freqdata.sort(function(a, b){return a.freq - b.freq});
            win.webContents.send('app-scan', {'words': freqdata});
        });
        // dbops.getCommon(filteredWords)
        // .then((data) => {
        //     const B = filteredWords.filter(n => !data.includes(n))


        // })
        // .catch((err)=>{
        //     console.log(err)
        // })
    });
});
