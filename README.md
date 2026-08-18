# DIGI RAKSHA – Cyber Safety Simulation Challenge

An immersive, gamified cybersecurity simulation and training web application designed specifically for school students (Classes 6–10) to build safety reflexes against online hazards.

Developed in cooperation with **IEEE SSIT (Society on Social Implications of Technology)**.

---

## 🎮 Key Features

1. **Mission Control (Cadet Dashboard)**: Tracks progress, lists daily safety tips, awards safety chest coins, and hosts training simulations.
2. **Interactive Simulations**:
   - **Phishing Trap**: Sort emails/alerts into "Safe" or "Phishing" cards.
   - **OTP Danger Zone**: Answer interactive phone inquiries on a simulated smartphone.
   - **Vishing Detective**: Analyze telephone voice logs and trigger a "FRAUD ALERT" buzzer.
   - **UPI + QR Safety**: Approve or reject payment requests based on scanner details.
3. **Safety Credentials Passport**: Displays rubber stamps and earned stars like a passport booklet.
4. **Interactive Cyber Quiz**: 10 timed safety trivia questions with briefing summaries.
5. **Creative Poster Arena**: A built-in HTML5 painting board with custom brushes and colors to draw safety campaigns.
6. **Cadet Leaderboard**: High-score boards for top students, classes, and schools.
7. **Certificate Graduation Center**: Generates landscape PDF/print certificates with a validation QR code.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons, Canvas Confetti.
* **Backend**: Spring Boot 3.2.4 (Java 17+), Spring Security, JPA Hibernate, PostgreSQL, JWT (jjwt).

---

## 🚀 Quick Start Guide

### 1. Database Setup
1. Open your PostgreSQL console and create a database:
   ```sql
   CREATE DATABASE digiraksha;
   ```
2. By default, the backend expects user `postgres` with password `postgres` at `localhost:5432`. You can customize this in `backend/src/main/resources/application.properties`.

### 2. Run Backend (Spring Boot)
From the root workspace, navigate to the `backend` folder and run:
```bash
cd backend
mvn spring-boot:run
```
*(If Maven is not installed globally, open the folder inside IntelliJ IDEA, Eclipse, or VS Code and press Run).*

### 3. Run Frontend (React + Vite)
Open another terminal, navigate to the `frontend` folder, and execute:
```bash
cd frontend
npm install
npm run dev
```
Now, open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Login Credentials (For Testing)
When launching the login screen, select one of the following tabs to test roles:

* **Student**: `student / password` (Rookie Cadet dashboard)
* **Volunteer**: `volunteer / password` (Queue management & poster scoring)
* **Admin**: `admin / password` (Command analytics & cadet management)

---

## 🌐 Deployment Guide

### Deploying Frontend on Vercel:
1. Connect your GitHub repository to **Vercel**.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Click **Deploy**. Vercel will automatically use `npm run build` and handle SPA routes cleanly using `vercel.json`.

### Deploying Backend on Render:
1. Create a **Web Service** on **Render**.
2. Connect your GitHub repository (`https://github.com/vishnutejabalasani/Digi_Raksha`).
3. Set **Root Directory** to `backend`.
4. Environment: `Java`.
5. Build Command: `mvn clean package -DskipTests`
6. Start Command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
7. Add Environment Variables (Optional for external PostgreSQL):
   - `PORT`: `8080` (or dynamic port provided by Render)
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<your-db-host>:<port>/<dbname>`
   - `SPRING_DATASOURCE_USERNAME`: `<your-db-username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
8. Click **Create Web Service**.

