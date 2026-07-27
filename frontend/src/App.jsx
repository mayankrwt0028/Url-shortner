import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState(null);

  const [urls, setUrls] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("Checking...");

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);

      if (response.ok) {
        setApiStatus("Online");
      } else {
        setApiStatus("Offline");
      }
    } catch (error) {
      setApiStatus("Offline");
    }
  };

  const fetchUrls = async () => {
    try {
      const response = await fetch(`${API_URL}/api/url`);

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setUrls(data.data);
    } catch (error) {
      console.log("Unable to fetch URLs");
    }
  };

  const shortenUrl = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setStats(null);

      const response = await fetch(`${API_URL}/api/url/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      const code = data.data.short_code;

      setShortCode(code);
      setShortUrl(`${API_URL}/api/url/${code}`);

      setMessage("Short URL created successfully");

      setUrl("");

      await fetchUrls();
    } catch (error) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);

      setMessage("URL copied!");
      setError("");
    } catch (error) {
      setError("Could not copy URL");
    }
  };

  const getStats = async (code = shortCode) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/url/stats/${code}`);

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to get statistics");
        return;
      }

      setStats(data.data);
    } catch (error) {
      setError("Unable to connect to server");
    }
  };

  const deleteUrl = async (code = shortCode) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/url/${code}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to delete URL");
        return;
      }

      // If deleting currently selected URL
      if (code === shortCode) {
        setShortUrl("");
        setShortCode("");
        setStats(null);
      }

      setMessage("Short URL deleted successfully");

      await fetchUrls();
    } catch (error) {
      setError("Unable to connect to server");
    }
  };

  useEffect(() => {
    checkHealth();
    fetchUrls();
  }, []);

  return (
    <div className="app">
      <div className="container">
        {/* HEADER */}

        <header className="header">
          <div>
            <h1>URL Shortener</h1>
          </div>

          <div className="status">
            <span
              className={
                apiStatus === "Online" ? "status-dot online" : "status-dot"
              }
            ></span>
            API {apiStatus}
          </div>
        </header>

        <div className="card">
          <h2>Shorten your URL</h2>

          <div className="input-section">
            <input
              type="text"
              placeholder="Enter your long URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button onClick={shortenUrl} disabled={loading}>
              {loading ? "Creating..." : "Shorten URL"}
            </button>
          </div>

          {message && <p className="success-message">{message}</p>}

          {error && <p className="error-message">{error}</p>}

          {shortUrl && (
            <div className="result-box">
              <h3>New Short URL</h3>

              <div className="short-url">
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
              </div>

              <div className="buttons">
                <button onClick={copyUrl}>Copy</button>

                <a
                  className="open-button"
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>

                <button onClick={() => getStats(shortCode)}>Get Stats</button>

                <button
                  className="delete-button"
                  onClick={() => deleteUrl(shortCode)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="urls-section">
          <div className="urls-header">
            <h2>Your Shortened URLs</h2>
          </div>

          {urls.length === 0 ? (
            <div className="empty-box">No shortened URLs yet.</div>
          ) : (
            <div className="url-list">
              {urls.map((item) => (
                <div className="url-card" key={item.id}>
                  <div className="url-info">
                    <div className="url-label">Original URL</div>

                    <p className="original-url">{item.original_url}</p>

                    <div className="url-label">Short URL</div>

                    <a
                      className="short-link"
                      href={`${API_URL}/api/url/${item.short_code}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {API_URL}/api/url/{item.short_code}
                    </a>
                  </div>

                  <div className="url-right">
                    <div className="click-box">
                      <strong>{item.clicks}</strong>

                      <span>Clicks</span>
                    </div>

                    <div className="url-actions">
                      <a
                        className="open-button"
                        href={`${API_URL}/api/url/${item.short_code}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>

                      <button
                        className="delete-button"
                        onClick={() => deleteUrl(item.short_code)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
