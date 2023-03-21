/* Připojení modulu frameworku Express */
const express = require("express");
/* Připojení externího modulu body-parser (https://www.npmjs.com/package/body-parser) - middleware pro parsování těla požadavku */ 
const bodyParser = require("body-parser"); 
/* Připojení externího modulu moment (https://momentjs.com/) - knihovna pro formátování datových a časových údajů */ 
const moment = require("moment"); 
/* Připojení vestavěných modulů fs (práce se soubory) a path (cesty v adresářové struktuře) */ 
const fs = require("fs"); 
const path = require("path");

/* Vytvoření základního objektu serverové aplikace */ 
const app = express();
/* Nastavení portu, na němž bude spuštěný server naslouchat */ 
const port = 3000;

/* Identifikace složky obsahující statické soubory klientské části webu */ 
app.use(express.static("public"));
/* Nastavení typu šablonovacího engine na pug*/ 
app.set("view engine", "pug"); 
/* Nastavení složky, kde budou umístěny šablony pug */ 
app.set("views", path.join(__dirname, "views"));

/* Využití modulu body-parser pro parsování těla požadavku */ 
const urlencodedParser = bodyParser.urlencoded({extended: false});
let datumZadani = moment().format('YYYY-MM-DD');
app.post('/savedata', urlencodedParser, function(req, res) {
  let data = `"${req.body.ukol}","${req.body.predmet}","${datumZadani}","${req.body.odevzdani}"\n`;
  fs.appendFile(path.join(__dirname, 'data/ukoly.csv'), data, function(err) {
    if (err) {
      console.log('Nastala chyba: ', err);
      return res.status(400).json({
        success: false,
        message: 'Nastala chyba při zápisu do souboru!'
      });
    };
    res.redirect(301, '/');
  });
})

app.get('/todolist', function(req, res) {
  fs.readFile(path.join(__dirname, 'data/ukoly.csv'), function(err, data) {
    res.send(data);
  });
});

app.get('/pokus', function(req, res) {
  res.render('index', {nadpis: 'Seznam úkolů'});
})

/* Spuštění webového serveru */ 
app.listen(port, () => {
  console.log(`Server naslouchá na portu ${port}`);
});
