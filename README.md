# Smart Waste Management System - Mobile App 🚛♻️

A mobile app that simplifies waste disposal through real-time tracking, smart scheduling, and location-based guidance. Designed to promote cleaner communities and sustainable living with an intuitive user experience.

This repository contains the mobile application for the **Smart Waste Management System**, developed as part of the SE3070 - Case Studies in Software Engineering (Assignment 02). The project is a critique and implementation of a provided case study design for a smart city waste management solution.

The application is built using **React Native** and **Expo Go**.

---

## 👨‍💻 Project Team

| Member Name          | Registration No. | Assigned Module Implemented          |
| -------------------- | ---------------- | ------------------------------------ |
| Athulathmudali A.L.M | IT21129544       | Bin & Collection Management          |
| Wijenayake W.M.P.J   | IT22194558       | Data Analytics & Reporting           |
| Kumarasinghe S.S     | IT22221414       | Collection Scheduling & Feedback     |
| Sandaru G.A          | IT22258908       | Payments & Rewards Management        |


---

## ✨ Key Features

The application is divided into four substantial business use cases, with each team member responsible for one:

* **Bin & Collection Management:** Allows waste collection crews to view routes, digitally record bin collections via scanning, and report exceptions like contamination or blocked access.
* **Data Analytics & Reporting:** Provides a dashboard for waste management authorities to view key performance indicators (KPIs), analyze waste data trends, and generate operational or billing reports.
* **Collection Scheduling:** Enables residents to schedule waste pickups for different bin types (regular, bulky, etc.) and provide service feedback after collection.
* **Payments & Rewards Management:** Allows residents to view their bills, apply recycling credits to reduce the total, and make payments through an integrated system.

---

## 📂 Folder Structure

To maintain a clean and scalable codebase, we will follow the structure below. All new files should be placed in the appropriate directory.

```
.
├── assets/                # Images, fonts, and other static assets
│   ├── fonts/
│   └── images/
├── src/                   # Main source code directory
│   ├── api/               # API calls and service integrations (e.g., Axios instances)
│   ├── components/        # Reusable UI components (Button, Card, InputField)
│   ├── constants/         # Global constants (colors, dimensions, API endpoints)
│   ├── context/           # React Context for global state management
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation logic (Stack, Tab navigators)
│   ├── screens/           # Top-level screen components, organized by feature
│   │   ├── Analytics/
│   │   ├── BinCollection/
│   │   ├── Payments/
│   │   └── Scheduling/
│   └── utils/             # Utility functions (e.g., date formatters, validators)
├── App.js                 # Root component of the application
└── package.json           # Project dependencies and scripts
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended)
* npm or yarn package manager
* Git
* **Expo Go** app installed on your physical Android or iOS device.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd <project-directory>
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```

---

## 📜 Available Scripts

In the project directory, you can run the following commands:

### `npm start`

Runs the app in development mode using the Expo CLI. You can then scan the QR code with the Expo Go app on your phone to open the project.

### `npm run android`

Opens the app on a connected Android device or emulator.

### `npm run ios`

Opens the app on a connected iOS device or the iOS Simulator (macOS only).

### `npm test`

Launches the test runner in interactive watch mode.
