/* eslint-disable no-console */
import { useState } from 'react';

export default function useFetch(url, payload) {
  const [data, setData] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    setData(null);
    setWaiting(true);
    setError(null);
    try {
      const response = await fetch(url, payload);

      // non-200 status codes will throw here
      if (!response.ok) {
        const text = await response.text();
        const errorString = `Request failed with status code ${response.status}${text && text.charAt(0) !== '<' ? `: ${text}` : '.'}`;
        throw new Error(errorString);
      }

      const responseJSON = await response.json();
      setData(responseJSON);
    } catch (e) {
      console.error(e);
      // account for non-status errors here - should add more i think...
      if (e instanceof TypeError) {
        setError('A network error occurred.');
      } else {
        setError(e.message);
      }
    }
    setWaiting(false);
  }

  return {
    data, waiting, error, fetchData,
  };
}
