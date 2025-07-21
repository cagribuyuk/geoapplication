# 🌍 GeoApplication

**GeoApplication** is an interactive geospatial web application built with modern frontend and mapping technologies. It allows users to perform distance measurements, compare two different map views side by side, and view top-down perspectives for geographic analysis.

---

## ✨ Features

- 📏 **Distance Measurement**: Users can draw lines or select multiple points on the map to calculate distances using geospatial algorithms.
- 🗺️ **Dual Map View**: Compare two map styles (e.g., satellite vs. street view) simultaneously for enhanced spatial awareness.
- 👁️ **Bird’s-Eye View**: Observe locations from a top-down perspective for better visual context.
- 🖍️ **Drawing Tools**: Mark, annotate, or outline areas of interest directly on the map using interactive drawing tools.
- 📊 **Geospatial Analytics**: Render spatial data and visualize results using charts and map overlays.

---

## 🛠️ Technologies Used

### 🔧 Core Frameworks & Libraries
- **React** – Frontend UI library
- **Express** – Lightweight backend server
- **TailwindCSS** – Utility-first CSS for styling

### 🗺️ Mapping & Geospatial
- **Maplibre GL** – Open-source map rendering
- **Maplibre GL Draw** – Draw tools for map interactions
- **@mapbox/polyline** – Decoding and encoding of polyline paths
- **@turf/turf** – Advanced geospatial analysis (distance, area, etc.)

### 📊 Visualization
- **Chart.js** & **react-chartjs-2** – Chart rendering
- **ZingChart** & **zingchart-react** – Advanced interactive charts

### 🧰 Utilities & UI
- **Lodash** – Functional utilities
- **Chakra UI** – Modular UI components
- **Heroicons / Headless UI** – Accessible UI patterns and icons
- **React Color** – Color picker components

### 🧪 Testing
- **Jest** & **React Testing Library** – Unit and integration testing tools

---

## 📦 Getting Started

To run the application locally:

```bash
git clone https://github.com/yourusername/geoapplication.git
cd geoapplication
npm install
npm start