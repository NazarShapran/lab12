import { useState } from 'react';
import Loader from '../components/Loader';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.dispatchEvent(
        new CustomEvent('app-toast', {
          detail: { message: 'Data loaded successfully!', type: 'success' },
        })
      );
    }, 2000);
  };

  return (
    <div className="page-container fade-in">
      <header className="hero">
        <h1 className="hero-title" tabIndex={-1}>Welcome to <span className="gradient-text">Lab12</span></h1>
        <p className="hero-subtitle">
          A premium React experience built with Vite and TypeScript.
          Explore the Todo list and Address Book features.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" aria-label="Start using Lab12 features" onClick={handleGetStarted}>Get Started</button>
          <button className="btn btn-outline" aria-label="Learn more about the project">Learn More</button>
        </div>
        <Loader isVisible={isLoading} message="Loading features..." />
      </header>
      
      <section className="features" aria-label="Key features">
        <div className="feature-card" role="article" aria-labelledby="feature-todo">
          <div className="feature-icon" aria-hidden="true">📋</div>
          <h3 id="feature-todo">Todo App</h3>
          <p>Stay organized with our sleek and intuitive task manager.</p>
        </div>
        <div className="feature-card" role="article" aria-labelledby="feature-address">
          <div className="feature-icon" aria-hidden="true">📇</div>
          <h3 id="feature-address">Address Book</h3>
          <p>Manage your contacts in a clean, modern interface.</p>
        </div>
        <div className="feature-card" role="article" aria-labelledby="feature-fast">
          <div className="feature-icon" aria-hidden="true">⚡</div>
          <h3 id="feature-fast">Fast & Responsive</h3>
          <p>Built with performance and user experience in mind.</p>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2026 Lab12 Project. Built for accessibility and performance.</p>
      </footer>
    </div>
  );
};

export default Home;
