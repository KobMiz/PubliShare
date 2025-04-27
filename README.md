# PubliShare - רשת חברתית מבית KobMiz

PubliShare הוא פרויקט רשת חברתית שמאפשר למשתמשים **לשתף פוסטים**, **לעקוב אחרי תכנים**, ולהתנסות באינטראקציות כמו **לייקים** ו**חיפושים**. הפרויקט כולל את כל התכנים שאתם צריכים ברשת חברתית מודרנית, כולל חוויית משתמש מותאמת במובייל ודסקטופ.

💻 הקוד המלא זמין ב־[GitHub](https://github.com/KobMiz/PubliShare).

---

## 🚀 **Key Features**

### 🔐 **ניהול משתמשים**

- **התחברות ורישום** באמצעות **JWT**.
- **ניהול פרופילים** עם תמונות פרופיל.
- **הרשאות לפי סוג משתמשים**: Admin ו-User.

### 📝 **ניהול פוסטים**

- **CRUD לפוסטים**: יצירה, עדכון, מחיקה.
- אינטראקציה עם פוסטים: **לייקים** ו**הערות**.
- **חיפוש בתוך הפוסטים**.

### 🔒 **אימות מאובטח**

- הצפנת סיסמאות עם **BcryptJS**.
- **הגנה על מסלולים מוגנים** עם **JWT**.

### 🎨 **עיצוב מודרני**

- **TailwindCSS** ו־**MUI** לעיצוב רספונסיבי וקל לשימוש.
- **תמיכה במובייל ודסקטופ**.

---

## 🔧 **System Requirements**

לפני שתתחיל, ודא שיש לך את הדרישות הבאות:

- **Node.js** (גרסה >= 16.x)
- **MongoDB** (לוקאלי או דרך Atlas)
- **npm** (גרסה >= 8.x)

---

## 🛠️ **Installation and Setup**

### 1️⃣ **Clone the Repository**:

```bash
git clone https://github.com/KobMiz/PubliShare.git
cd PubliShare
```

### 2️⃣ **התקנת תלויות**:

#### בלקוח (Client):

```bash
cd client
npm install
```

#### בשרת (Server):

```bash
cd server
npm install
```

### 3️⃣ **הגדרת משתני סביבה**:

צור קובץ `.env` בתיקיית `server` על בסיס הקובץ `env.example` המצורף, עם הערכים הבאים:

```env
PORT=3000
MONGO_URI=your-mongodb-connection-string
MONGO_URI_PROD=your-mongodb-production-string
JWT_SECRET=your-jwt-secret
NODE_ENV=development
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

📄 קובץ לדוגמה בשם `env.example` נמצא בפרויקט – השתמש בו כבסיס ליצירת `.env`.

### 3.5️⃣ **(אופציונלי) הזנת נתוני התחלה ל-DB**:

להרצת משתמשים וכרטיסים התחלתיים (seed), הרץ:

```bash
npm run seed
```

> ⚠️ ודא שמוגדר `MONGO_URI` תקף בקובץ `.env` לפני ההרצה.

### 4️⃣ **הפעל את השרת**:

```bash
npm start
```

### 5️⃣ **הפעל את הלקוח**:

```bash
cd ../client
npm run dev
```

---

## 📜 **API Documentation**

ה־API של PubliShare מתועד באמצעות **Swagger**. כדי לגשת לדוקומנטציה:

1. הפעל את השרת.
2. עבור ל־[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### 📝 **Routes לדוגמה**:

#### **משתמשים**:

- `POST /users/register`: רישום משתמש חדש.
- `POST /users/login`: התחברות.
- `GET /users`: קבלת כל המשתמשים (Admin בלבד).
- `PATCH /users/:id`: עדכון פרטי משתמש.
- `DELETE /users/:id`: מחיקת משתמש (Admin בלבד).

#### **פוסטים**:

- `POST /cards`: יצירת פוסט חדש.
- `GET /cards`: קבלת כל הפוסטים.
- `PATCH /cards/:id/like`: הוספת/הסרת לייק לפוסט.
- `PUT /cards/:id`: עדכון פוסט.
- `DELETE /cards/:id`: מחיקת פוסט (Admin בלבד).

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

## 🏗️ **Project Structure**

```
PubliShare/
├── server/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middlewares/
│   ├── config/
│   ├── initialData.js
│   ├── .env.example
│   ├── index.js
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── public/
├── .gitignore
├── README.md
└── package.json
```

---

## 🧩 **Dependencies**

- **Core**: Express, Mongoose, Dotenv
- **Authentication**: BcryptJS, JSON Web Token (JWT)
- **Frontend**: React, MUI, TailwindCSS
- **Utilities**: Morgan, CORS, Nodemailer, Joi, Swagger

---

## 🌍 **Deployment**

1. ודא שהגדרת את משתני הסביבה לייצור (`MONGO_URI_PROD`, `NODE_ENV=production`).
2. פרוס לפלטפורמות כמו **Heroku**, **Render**, **AWS**, או **Vercel**.
3. ודא שהחיבור ל־MongoDB Atlas עובד.

---

## 🏁 **Project Status**

הפרויקט הושלם ומוכן לפריסה. תוספות עתידיות עשויות לכלול אפשרויות חיפוש משופרות, תמיכה במדיה (תמונות ווידאו), ושיפורי ביצועים.

---

## 💬 **Support**

לשאלות, בעיות או פידבק — ניתן ליצור קשר באחת מהדרכים הבאות:

- דרך [GitHub Issues](https://github.com/KobMiz/PubliShare/issues)
- במייל: [kobimizrachi@icloud.com](mailto:kobimizrachi@icloud.com)

---

## 🚀 **Future Improvements**

- הוספת בדיקות אוטומטיות עם Jest.
- הטמעת ניהול תור ובקשות במקביל (Concurrency Management).
- שיפורי ביצועים עם סקאלאביליות למשתמשים רבים.

---

## 📚 **Swagger Viewer**

ניתן לצפות בתיעוד המלא של ה־API באמצעות Swagger בקישור הבא (לאחר הפעלת השרת המקומי):

🔗 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

ב־Swagger תוכל לבדוק את כל מסלולי המשתמשים, הפוסטים, התגובות והחיפוש בצורה אינטראקטיבית, כולל אפשרות לשלוח בקשות ישירות מהדפדפן.

---
