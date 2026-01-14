import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import SortingVisualizer from './pages/Sorting/SortingVisualizer';
import SearchingVisualizer from './pages/Searching/SearchingVisualizer';
import TreeVisualizer from './pages/Tree/TreeVisualizer';
import StackQueueVisualizer from './pages/StackQueue/StackQueueVisualizer';
import GraphVisualizer from './pages/Graphs/GraphVisualizer';
import CodeVisualizer from './pages/CodeVisualizer/CodeVisualizer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/searching" element={<SearchingVisualizer />} />
          <Route path="/trees" element={<TreeVisualizer />} />
          <Route path="/stack-queue" element={<StackQueueVisualizer />} />
          <Route path="/graphs" element={<GraphVisualizer />} />
          <Route path="/code-visualizer" element={<CodeVisualizer />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;