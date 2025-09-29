# Fyxed Wonen - Property Rental Platform

Een moderne huurwoning platform geïnspireerd door HuurGenie, gebouwd met Node.js, React, TypeScript en MongoDB Atlas.

## 🚀 Snel opstarten

### Vereisten
- Node.js (versie 16 of hoger)
- MongoDB Atlas account (gratis)
- Git

### 1. MongoDB Atlas Opzetten

1. Ga naar [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Maak een gratis account aan
3. Maak een nieuwe cluster aan (M0 Sandbox - gratis)
4. Ga naar "Database Access" en maak een database gebruiker aan
5. Ga naar "Network Access" en voeg je IP adres toe (of 0.0.0.0/0 voor development)
6. Ga naar "Connect" → "Connect your application"
7. Kopieer de connection string

### 2. Project Installeren

```bash
# Clone het project
git clone <repository-url>
cd fyxedwonen

# Installeer root dependencies
npm install

# Installeer server dependencies
cd server
npm install

# Installeer client dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Configuratie

```bash
# Kopieer het example bestand
cp server/.env.example server/.env
```

Open `server/.env` en vul je MongoDB Atlas gegevens in:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/fyxedwonen?retryWrites=true&w=majority
JWT_SECRET=jouw_veilige_jwt_secret_hier
```

Vervang:
- `<username>` - Je MongoDB Atlas gebruikersnaam
- `<password>` - Je MongoDB Atlas wachtwoord
- `<cluster-name>` - Je MongoDB Atlas cluster naam

### 4. Applicatie Starten

```bash
# Start beide servers (backend + frontend)
npm run dev
```

Of apart:

```bash
# Backend starten (poort 5000)
npm run server

# Frontend starten (poort 3000)
npm run client
```

## 📱 Pagina's

### Homepage (/)
- Hero sectie met zoekformulier
- Features sectie
- Populaire steden

### Zoekresultaten (/woning)
- Filter sidebar
- Property grid met kaarten
- Paginering en sortering

### Property Detail (/woning/:id)
- Gedetailleerde property informatie
- Contact formulier
- Login prompt voor volledige details
- Vergelijkbare properties

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Styled Components** - CSS-in-JS styling
- **React Router** - Navigation
- **Axios** - HTTP client

## 🎨 Design

Het design is een exacte replica van HuurGenie met:
- Zelfde kleurenschema (#38b6ff blauw, #fd7e14 oranje)
- Identieke layout en typografie
- Responsive design
- Modern UI/UX

## 📁 Project Structuur

```
fyxedwonen/
├── server/                 # Backend API
│   ├── models/            # Mongoose modellen
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js          # Server entry point
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/   # Herbruikbare componenten
│   │   ├── pages/        # Pagina componenten
│   │   ├── services/     # API services
│   │   ├── styles/       # Global styles
│   │   └── types/        # TypeScript types
│   └── public/           # Statische bestanden
└── package.json          # Root package.json
```

## 🔧 Available Scripts

```bash
npm run dev        # Start beide servers
npm run server     # Start alleen backend
npm run client     # Start alleen frontend
npm run build      # Build frontend voor productie
npm start          # Start productie server
```

## 🐛 Troubleshooting

### MongoDB Connection Errors
- Controleer je `.env` bestand
- Zorg dat je IP adres is toegevoegd in MongoDB Atlas Network Access
- Controleer je database gebruiker credentials

### Port Conflicts
- Backend draait op poort 5000
- Frontend draait op poort 3000
- Zorg dat deze poorten vrij zijn

### Dependencies Issues
```bash
# Verwijder node_modules en reinstall
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json
npm install
cd server && npm install
cd ../client && npm install
```

## 📝 To-Do / Volgende Features

- [ ] User authentication/login systeem
- [ ] Favorieten functionaliteit
- [ ] Image upload voor properties
- [ ] Email notificaties
- [ ] Advanced filters
- [ ] Map integratie
- [ ] Admin dashboard

## 📄 License

MIT License - zie LICENSE file voor details.