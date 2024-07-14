import React, { useState } from "react";
import "./App.css";
import { truncateText } from "./utils";
import useFetch from "./customhooks/useFetch";

function App() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("stars");
  const [selectedSort, setSelectedSort] = useState("stars");
  const [data, loading, error, toggle] = useFetch(query, sort);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() && selectedSort) {
      setQuery(search);
      setSort(selectedSort);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GitHub Repositories</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Search for repositories"
          />
          <select value={selectedSort} onChange={handleSortChange}>
            <option value="stars">Stars</option>
            <option value="watchers_count">Watchers count</option>
            <option value="score">Score</option>
            <option value="name">Name</option>
            <option value="created">Created at</option>
            <option value="updated">Updated at</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </header>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="repo-cards">
          {data &&
            data.map((repo) => (
              <div key={repo.id} className="repo-card">
                <div className="card-head">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="avatar"
                  />
                  <h4>{truncateText(repo.name, 20)}</h4>
                </div>
                <p>{truncateText(repo.description, 70)}</p>
                <p>
                  <strong>Stars:</strong> {repo.stargazers_count}
                </p>
                <p>
                  <strong>Language:</strong> {repo.language}
                </p>
              </div>
            ))}
        </div>
      )}
      {toggle && <div className="no-data-popup">No data found</div>}
    </div>
  );
}

export default App;
