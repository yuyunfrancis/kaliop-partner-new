import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import UserContext from '../contexts/UserContext';

const useDataFetching = url => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const {user} = useContext(UserContext);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + user.token,
        },
      });
      const result = await data.json();

      if (result) {
        setData(result);
        // console.log('result', result);
        setLoading(false);
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    // TODO: delete cash
  }, [url]);

  return [loading, error, data, fetchData];
};

export default useDataFetching;
