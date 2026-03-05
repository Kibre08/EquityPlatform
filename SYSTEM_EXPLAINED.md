# 🧠 Equity Platform: System Architecture Breakdown

This guide explains how your project works from top to bottom. This is perfect for explaining your project to an examiner.

---

## 1. The MERN Stack: Roles & Responsibilities

Your project uses the **MERN** stack. Here is what each letter does:

| Component | Technology | Role in Your Project |
| :--- | :--- | :--- |
| **M** | **MongoDB** | The **Database**. It stores all your "Permanent Data" (Users, Campaigns, Content). |
| **E** | **Express** | The **API Manager**. It listens for requests from the frontend and routes them to the right logic. |
| **R** | **React** | The **User Interface (UI)**. This is what you see in the browser. It handles buttons, forms, and pages. |
| **N** | **Node.js** | The **Engine**. It allows JavaScript to run on your computer/server (backend). |

---

## 2. How Communication Works (API & HTTP)

The Frontend and Backend are like a **Customer** and a **Waiter** in a restaurant.

*   **The Frontend (Customer)** wants data.
*   **The Backend (Waiter)** brings the data from the kitchen (Database).
*   **The Communication Method** is called an **HTTP Request**.

### 🛠️ The 4 HTTP Methods You Use:
1.  **GET**: "Get me data." (e.g., Viewing the list of campaigns).
2.  **POST**: "Create something new." (e.g., Registering a user or Launching a campaign).
3.  **PUT**: "Update something existing." (e.g., Editing your profile).
4.  **DELETE**: "Remove something." (e.g., Deleting a draft campaign).

---

## 3. Core Workflows (Examples)

### 🔐 Workflow A: User Login
1.  **Frontend**: User enters email/password in `Login.jsx` and clicks "Login".
2.  **Request**: Frontend sends a **POST** request to `/api/auth/login` using **Axios** (the tool in `api.js`).
3.  **Backend**: `authRoutes.js` receives the request. It checks the Database (MongoDB) to see if the user exists and the password matches.
4.  **token**: If valid, the backend sends back a **JWT Token** (a digital "Key").
5.  **Frontend**: Saves the Key in `localStorage` so the user stays logged in.

### 🚀 Workflow B: IP Awareness & Resources
1.  **Frontend**: User visits `IPAwareness.jsx`.
2.  **Logic**: Since this is "Educational," the data is mostly **hardcoded** in the frontend for speed.
3.  **Interaction**: If the user wants to see *their* specific IP documents, the frontend sends a **GET** request to `/api/ipdocs/me`.
4.  **Backend**: Fetchs specific files from the `uploads/` folder and database entries, then sends them back.

---

## 4. Why This Architecture is "Powerful"?
*   **Decoupled**: You can change the UI without breaking the data.
*   **Scalable**: You can host the frontend on Vercel and the backend on Render separately.
*   **Secure**: Sensitive data (passwords) stays on the backend/database; the frontend only gets what it needs to display.
