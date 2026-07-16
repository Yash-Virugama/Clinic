import React from "react";
import NotFound from "../../pages/NotFound/NotFound";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Pass the error to the NotFound page so it renders the error message
      return <NotFound error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
