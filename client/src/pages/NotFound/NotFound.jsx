import { Link } from "react-router-dom";
import "./NotFound.css";
import { useEffect } from "react";

const NotFound = ({ error }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="not-found-container bg-grid-blueprint-dark ">
      {/* Ambient background glows */}
      <div className="ambient-glow primary-glow" />
      <div className="ambient-glow accent-glow" />

      <div className="not-found-card w-lg">
        <h1 className={error ? "error-title" : "title-404"}>
          {error ? "Oops!" : "404"}
        </h1>
        <h2 className="subtitle">
          {error ? "Something Went Wrong" : "Page Not Found"}
        </h2>
        <p className="description">
          {error
            ? "An unexpected error occurred during rendering. Please check the log details below or return to the home page."
            : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </p>

        {error && (
          <div className="error-details-wrapper">
            <span className="error-badge">Error Log</span>
            <pre className="error-pre">
              {error.toString()}
            </pre>
          </div>
        )}

        <div className="actions-wrapper">
          <Link
            to="/"
            onClick={() => {
              if (error) {
                // Hard reload to clear error boundary state and go home
                window.location.href = "/";
              }
            }}
            className="action-btn-primary"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;