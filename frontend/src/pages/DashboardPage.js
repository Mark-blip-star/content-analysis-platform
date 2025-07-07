import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function DashboardPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchContent = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/content-submission`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleQuickSubmit = () => {
    navigate("/submit");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Submissions</h2>
        <div>
          <button onClick={handleQuickSubmit} className="btn btn-success me-2">
            + Submit New
          </button>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Logout
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="alert alert-info text-center">No submissions yet.</div>
      ) : (
        <div className="row">
          {items.map((item) => (
            <div className="col-md-6 mb-4" key={item.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="mb-1">
                    <strong>Type:</strong> {item.type}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong> {item.status}
                  </p>
                  {item.summary && (
                    <>
                      <p className="mt-2 mb-1">
                        <strong>Summary:</strong> {item.summary}
                      </p>
                      <p className="mb-0">
                        <strong>Keywords:</strong>{" "}
                        {item.keywords
                          ? Array.isArray(item.keywords)
                            ? item.keywords.join(", ")
                            : item.keywords
                          : "N/A"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
