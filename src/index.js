import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MapView from './MapView';
import EventDetails from './EventDetails'
import reportWebVitals from './reportWebVitals';
import { hydrateRoot } from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router";

//const root = ReactDOM.createRoot(document.getElementById('app'));
const root = document.getElementById("app");
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MapView />} />
      <Route path="event/:eventId" element={<EventDetails />} />
    </Routes>
  </BrowserRouter>
);
//hydrateRoot(document.getElementById('app'), <MapView />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
