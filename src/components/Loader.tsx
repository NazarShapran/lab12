import './Loader.css';

interface LoaderProps {
  message?: string;
  isVisible: boolean;
}

const Loader = ({ message = 'Loading...', isVisible }: LoaderProps) => {
  if (!isVisible) return null;

  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <span className="sr-only">{message}</span>
    </div>
  );
};

export default Loader;
