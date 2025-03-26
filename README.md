
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

צור קובץ `.env` בתיקיית השורש של הפרויקט עם המשתנים הבאים:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

### 4️⃣ **הפעל את השרת**:

#### בסביבת פיתוח:

```bash
cd server
npm run dev
```

#### בסביבת ייצור:

```bash
npm start
```

### 5️⃣ **הפעל את הלקוח**:

```bash
cd client
npm run dev
```

---

## 📜 **API Documentation**

ה־API של PubliShare מתועד באמצעות **Swagger**. כדי לגשת לדוקומנטציה:

1. הפעל את השרת.
2. עבור ל־`http://localhost:5000/api-docs` בדפדפן שלך.

### 📝 **Routes לדוגמה**:

#### **משתמשים**:
- `POST /users/register`: רישום משתמש חדש.
- `POST /users/login`: התחברות.
- `GET /users`: קבלת כל המשתמשים (Admin בלבד).
- `PATCH /users/:id`: עדכון פרטי משתמש.
- `DELETE /users/:id`: מחיקת משתמש (Admin בלבד).

#### **פוסטים**:
- `POST /posts`: יצירת פוסט חדש.
- `GET /posts`: קבלת כל הפוסטים.
- `PATCH /posts/:id/like`: הוספת/הסרת לייק לפוסט.
- `PUT /posts/:id`: עדכון פוסט.
- `DELETE /posts/:id`: מחיקת פוסט (Admin בלבד).

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

## 🧩 **Dependencies**

- **Core**: Express, Mongoose, Dotenv
- **Authentication**: BcryptJS, JSON Web Token (JWT)
- **Frontend**: React, MUI, TailwindCSS
- **Utilities**: Morgan, CORS

---

## 🌍 **Deployment**

1. ודא שהגדרת את משתני הסביבה לייצור.
2. פרוס לפלטפורמות כמו **Heroku**, **AWS**, או **Vercel**.
3. ודא שהחיבור ל־MongoDB Atlas עובד בסביבת ייצור.

---

## 🏁 **Project Status**

הפרויקט הושלם ומוכן לפריסה. תוספות עתידיות עשויות לכלול אפשרויות חיפוש משופרות, תמיכה במדיה (תמונות ווידאו), ושיפורי ביצועים.

---

## 💬 **Support**

לשאלות או בעיות, ניתן ליצור קשר דרך [GitHub Issues](https://github.com/KobMiz/PubliShare/issues).

---

## 🚀 **Future Improvements**

- הוספת בדיקות אוטומטיות עם Jest.
- הטמעת ניהול תור ובקשות במקביל (Concurrency Management).
- שיפורי ביצועים עם סקאלאביליות למשתמשים רבים.
