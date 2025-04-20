# Rect - IoT Device Management Frontend

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Implementation Details](#implementation-details)
- [Backend Repository](#backend-repository)
- [PlatformIO Library](#platformio-library)
- [Contact](#contact)

## Overview
Rect is the frontend for an IoT device management platform that allows users to control and monitor ESP32 and ESP8266 devices via MQTT. It provides an intuitive dashboard with real-time updates and device sharing capabilities. The UI is designed using **React.js** and **IBM’s Carbon Design System** for a modern and responsive experience.

## Features
- **Customizable Dashboard**: Users can monitor and control devices in real-time.
- **Device Management**: Allows secure device registration and control.
- **Real-time Communication**: Integrates with WebSockets for live updates.
- **User Authentication**: Implements **JWT-based authentication** for secure access.
- **Collaboration Features**: Enables device sharing with other users.

## Technologies Used
- **React.js** – Frontend framework
- **IBM Carbon Design System** – UI/UX components
- **WebSocket** – Real-time data updates
- **Axios** – API communication
- **React Router** – Client-side navigation

## Implementation Details
### **UI/UX Design**
- Built with **IBM’s Carbon Design System** for a consistent and modern user interface.
- Uses **React hooks** for component-based state management.

### **Device Communication & Real-Time Updates**
- WebSockets ensure real-time data synchronization with the backend.
- MQTT messages are processed by the backend and reflected on the dashboard.

### **Authentication & Authorization**
- Users authenticate via **JWT tokens**, ensuring secure access control.
- Role-based access restricts dashboard features accordingly.

## Backend Repository
The backend for this project is built using **Java Spring Boot**.

🔗 **Backend Repository:** [https://github.com/cibikomberi/rect-backend](https://github.com/cibikomberi/rect-backend)

## PlatformIO Library
A dedicated **PlatformIO Library** is available for ESP32/ESP8266 devices to communicate with the Rect backend.

🔗 **PlatformIO Library:** [https://github.com/cibikomberi/Rect](https://github.com/cibikomberi/Rect)

## Contact
For any queries or support, please contact [cibikomberi@gmail.com](mailto:cibikomberi@gmail.com).

---
*Thank you for using Rect Frontend!* 🚀
