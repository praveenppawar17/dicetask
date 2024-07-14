import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (query, sort) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (!query) return; // prevents fetch iif the query is empty

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(
            query
          )}&sort=${sort}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        console.log('respose... ', response)
        if (response.status === 200) {
          if (response.data.total_count === 0) {
            setToggle(true);
            setData([]);
          } else {
            setData(response.data.items);
            setToggle(false);
          }
        } else {
          setError(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        if (err.response) {
          setError(
            `Error: ${err.response.status} - ${err.response.data.message}`
          );
        } else if (err.request) {
          setError("Error: No response received from server");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, sort]);

  return [data, loading, error, toggle];
};

export default useFetch;
