import React, { useEffect, useState } from "react";

const Results = () => {

  const [testResults, setTestResults] = useState(null);

  const parsePrefixes = (prefixes) => {
    return prefixes.map(parsePrefix)
      .reduce((acc, {name, time, key, timestamp}) => {
        return {
          ...acc,
          [name]: {
            results: [
              ...(acc[name] && acc[name].results || []),
              {name, time, key, timestamp}
            ].sort((a, b) => b.timestamp - a.timestamp)
          }
        };
      }, []);
  };

  const parsePrefix = (prefix) => {
    const parsedDate = prefix.split('-')[1].replace(
      /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d\d)\/$/,
      '$2/$3/$1 at $4:$5:$6'
    );
    return {
      name: prefix.split('-')[0],
      time: parsedDate,
      timestamp: parseInt(prefix.split('-')[1]),
      key: prefix,
    };
  };

  useEffect(() => {
    fetch('https://storage.googleapis.com/storage/v1/b/ilp-shenanigans-load-test-results/o?delimiter=%2F').then((response) => {
      response.json().then(json => {
        // setTestResults(json.prefixes.map(parsePrefix));
        console.log(parsePrefixes(json.prefixes));
        setTestResults(parsePrefixes(json.prefixes));
      });
    })
  }, [setTestResults]);

  return (
    <div>
      {testResults && Object.keys(testResults).map(key => (
        <div key={key}>
          <h4>{key}</h4>
          <ul>
            {testResults[key].results.map((prefix) => (
              <li key={prefix.key}>
                <a target="_blank" href={`http://storage.googleapis.com/ilp-shenanigans-load-test-results/${prefix.key}index.html`}>
                  {prefix.time}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))
      }
    </div>
  )
};

export default Results;
