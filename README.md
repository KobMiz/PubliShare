
# PubliShare

PubliShare הוא פרויקט רשת חברתית שמאפשר למשתמשים לשתף פוסטים, לעקוב אחרי תכנים, ולבצע אינטראקציות כמו לייקים. הפרויקט בנוי ב־React בצד הלקוח ו־Node.js בצד השרת, עם MongoDB כפתרון למסד נתונים.

הקוד המלא זמין ב־[GitHub](https://github.com/KobMiz/PubliShare).

---

## **Key Features**

- **User Management**:
  - יצירת משתמשים והתחברות באמצעות JWT.
  - ניהול פרופילים והגבלות לפי סוגי משתמשים (Admin, Regular).
  - חוויית משתמש רספונסיבית (רקעים רגישים למכשירים שונים).
- **Post Management**:
  - CRUD לפוסטים (יצירה, עדכון, מחיקה).
  - אינטראקציה עם פוסטים (לייקים).
  - חיפוש בתוך הפוסטים.
- **Authentication**:
  - אימות באמצעות JWT עם הגנה על מסלולים מוגנים.
  - הצפנת סיסמאות באמצעות BcryptJS.
- **Design & UX**:
  - עיצוב מודרני עם TailwindCSS ו-MUI.
  - ממשק משתמש אינטואיטיבי וקל לשימוש.
  
---

## **System Requirements**

- Node.js >= 16.x
- MongoDB (local או Atlas)
- npm >= 8.x

---

## **Installation and Setup**

### Clone the Repository:

```bash
git clone https://github.com/KobMiz/PubliShare.git
cd PubliShare
```

### Install Dependencies:

```bash
cd client
npm install
cd ../server
npm install
```

### Set Up Environment Variables:

צור קובץ `.env` בתיקיית השורש של הפרויקט עם המשתנים הבאים:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

השתמש בקובץ `.env.example` בתיקיית השרת כראיה.

### Start the Server:

#### Development:

```bash
cd server
npm run dev
```

#### Production:

```bash
npm start
```

### Start the Client:

```bash
cd client
npm run dev
```

---

## **API Documentation**

ה־API מתועד באמצעות Swagger. כדי לגשת לדוקומנטציה:

1. הפעל את השרת.
2. עבור ל־`http://localhost:5000/api-docs` בדפדפן שלך.

### Example Routes:

- **User Routes**:
  - `POST /users/register` - רישום משתמש חדש.
  - `POST /users/login` - התחברות.
  - `GET /users` - קבלת כל המשתמשים (Admin בלבד).
  - `PATCH /users/:id` - עדכון פרטי משתמש.
  - `DELETE /users/:id` - מחיקת משתמש (Admin בלבד).
- **Post Routes**:
  - `POST /posts` - יצירת פוסט.
  - `GET /posts` - קבלת כל הפוסטים.
  - `PATCH /posts/:id/like` - חיבור/הסרת לייק לפוסט.
  - `PUT /posts/:id` - עדכון פוסט.
  - `DELETE /posts/:id` - מחיקת פוסט (Admin בלבד).

#### Sample API Request and Response:

```json
POST /users/login
Headers:
{
  "Content-Type": "application/json"
}
Body:
{
  "email": "user@example.com",
  "password": "123456"
}
Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

## **Project Structure**

```
PubliShare/
├── server/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middlewares/
│   ├── config/
│   ├── .env
│   ├── index.js
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── package.json
├── .gitignore
├── README.md
└── package.json
```

---

## **Dependencies**

- **Core**: Express, Mongoose, Dotenv
- **Authentication**: BcryptJS, JSON Web Token (JWT)
- **Frontend**: React, MUI, TailwindCSS
- **Utilities**: Morgan, CORS

---

## **Deployment**

1. ודא שהגדרת את משתני הסביבה לייצור.
2. פרוס לפלטפורמות כמו **Heroku**, **AWS**, או **Vercel**.
3. ודא שהחיבור ל־MongoDB Atlas עובד בסביבת ייצור.

---

## **Project Status**

הפרויקט הושלם ומוכן לפריסה. תוספות עתידיות עשויות לכלול אפשרויות חיפוש משופרות, תמיכה במדיה (תמונות ווידאו), ושיפורי ביצועים.

---

## **Support**

לשאלות או בעיות, ניתן ליצור קשר דרך [GitHub Issues](https://github.com/KobMiz/PubliShare/issues).

---

## **Future Improvements**

- הוספת בדיקות אוטומטיות עם Jest.
- הטמעת ניהול תור ובקשות במקביל (Concurrency Management).
- שיפורי ביצועים עם סקאלאביליות למשתמשים רבים.
