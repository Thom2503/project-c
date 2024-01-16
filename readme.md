# Project C - Clubhuis
![cavero logo](https://github.com/Thom2503/project-c/blob/main/client/public/image.png)
## Omschrijving
Dit is onze repository met de code voor Project C of Project Clubhuis voor Cavero, dit is een sociale kalender
die FOMO momenten moet creeeren voor de medewerkers. Wij hebben voor dit project gebruik gemaakt van [PHP](https://php.net/) voor de API
en [ReactJS](https://react.dev/) voor de frontend.
## Setup
### Backend
#### 1. Installeer XAMPP
Download en installeer XAMPP als je dit niet al hebt
#### 2. Clone de repo
Clone deze repo in de top directory van XAMPP dat is htdocs
```bash
$ git clone https://github.com/Thom2503/project-c.git
```
Het moet er dan zo uit zien:
```
htdocs/
|
├── Controller/
|   └── ...
├── Model/
|   └── ...
├── api/
|   └── ...
├── client/
|   └── ...
├── db/
|   └── ...
├── include/
|   └── ...
|
├── .gitignore
├── .htacces
├── index.php
└── util_functions.php
```
#### 3. Start Apache
In XAMPP start de Apache server op port 80
#### 4. Geef de goede rechten aan db/project.db
Het kan zijn dat de rechten nog verkeerd zijn van project.db dus je moet nog alle bestanden de goede rechten geven
daarbij kan het zijn dat dit met sudo gedaan moet worden.
```bash
$ sudo chmod 777 db/project.db
$ chmod 777 db/project.db-wal
$ chmod 777 db/project.db-shm
$ chmod 777 db/
```
### Frontend
#### 1. Navigeer naar de frontend folder
```bash
$ cd client
```
#### 2. Installeer de dependencies
```bash
$ npm install
```
#### 3. Run de development server
```bash
$ npm start
```
open dan [localhost:3000](http://localhost:3000) om de website te bekijken en gebruiken
##### Extra - admin account
Het is misschien handig om het in het begin met een admin account te openen. Dit is het account:
email: `admin@cavero.nl` en als wachtwoord: `Admin1234`
Voor de 2FA zou er waarschijnlijk in de database gekeken moeten worden in de `TempKeys` tabel.
## Contributers
- [Thom Veldhuis](https://github.com/Thom2503)
- [Joel Verveer](https://github.com/joelhogeschool)
- [Luca Stuart](https://github.com/lucastuart)
- [Jimmy Tran](https://github.com/Jimmy-Tran)
## Dankbetuigingen
- [php](https://www.php.net/)
- [react](https://www.react.dev/)
- [PHPMailer](https://github.com/PHPMailer/PHPMailer)
