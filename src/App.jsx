import "./App.css";
import config from './config';
import meeedly from "./assets/global_summer_challenge_logo.jfif";
import global from "./assets/meeedly_logo.jfif";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { useState, useEffect } from "react";

function App() {
  const [voted, setVoted] = useState(
    localStorage.getItem("hasVoted") === "true"
  );
  const [showCopied, setShowCopied] = useState(false);
  const [showFailedCopied, setFailedShowCopied] = useState(false);

  const [data, setData] = useState([
    {
      name: "Group A",
      value: 1,
    },
    {
      name: "Group B",
      value: 1,
    },
    {
      name: "Group C",
      value: 1,
    },
    {
      name: "Group D",
      value: 1,
    },
    {
      name: "Group E",
      value: 1,
    },
    {
      name: "Group F",
      value: 1,
    },
  ]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#DA2700",
    "#B110F2",
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  function checkRes(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  function getData() {
     return fetch(`${config.API_URL}/votes`)
     .then(checkRes)
     .catch(console.error);
  }

  function addVote(name) {
    return fetch(`${config.API_URL}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
   }).then(checkRes);
 }

  /*const reset = () => {
    localStorage.setItem("hasVoted", "false");
    setVoted(false);
    console.log(localStorage.getItem("hasVoted"));
    console.log(voted);
  };*/

  const addCount = (groupName) => {
    console.log(groupName);
    if (!voted) {
      handleVote(groupName);
    } else {
      alert("already voted");
    }
  };

  const handleVote = (groupName) => {
    if (!voted) {
      addVote(groupName).then(() => {
        setVoted(true);
        localStorage.setItem("hasVoted", "true");
        // Fetch updated data from backend after voting
        getData().then((res) => setData(res));
      });
    }
  };

  const copyLink = () => {
    const link =
      "https://www.linkedin.com/showcase/global-summer-challenge/posts/?feedView=all";
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000); // Show for 2 seconds
      })
      .catch(() => {
        setFailedShowCopied(true);
        setTimeout(() => setFailedShowCopied(false), 2000); // Show for 2 seconds
      });
  };

  useEffect(() => {
    getData()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to fetch votes:", err);
        setVotes(data); // fallback to prevent crash
      });
  }, [voted]);

  return (
    <div className="app">
      <section className="app__content">
        <img src={meeedly} />
        <img src={global} />
        <h2>What's the best subject?</h2>
        <div className="app__subjects">
          <button
            className="app__subjects_SE"
            onClick={() => addCount("Group A")}
          >
            Software Engineering
          </button>
          <button
            className="app__subjects_BS"
            onClick={() => addCount("Group B")}
          >
            Business Studies
          </button>
          <button
            className="app__subjects_F"
            onClick={() => addCount("Group C")}
          >
            Finance
          </button>
          <button
            className="app__subjects_MS"
            onClick={() => addCount("Group D")}
          >
            Medical Studies
          </button>
          <button
            className="app__subjects_E"
            onClick={() => addCount("Group E")}
          >
            Engineering
          </button>
          <button onClick={resetVote}>Reset Vote</button>
        </div>

        {!voted && (
          <div className="app__subjects">
            <button
              className="app__subjects_SE"
              onClick={() => addCount("Group A")}
            >
              Software Engineering
            </button>
            <button
              className="app__subjects_BS"
              onClick={() => addCount("Group B")}
            >
              Business Studies
            </button>
            <button
              className="app__subjects_F"
              onClick={() => addCount("Group C")}
            >
              Finance
            </button>
            <button
              className="app__subjects_MS"
              onClick={() => addCount("Group D")}
            >
              Medical Studies
            </button>
            <button
              className="app__subjects_E"
              onClick={() => addCount("Group E")}
            >
              Engineering
            </button>
            <button
              className="app__subjects_P"
              onClick={() => addCount("Group F")}
            >
              Phyiscs
            </button>
          </div>
        )}
      </section>
      <div className="app__voteData">
        <ResponsiveContainer aspect={1}>
          <PieChart>
            <Pie
              data={data.map((d) => ({ ...d, value: Number(d.value) }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {showCopied && (
        <div className="copied-message">Link copied to clipboard!</div>
      )}
      {showFailedCopied && (
        <div className="copied-message">Failed to copy link.</div>
      )}
      <button onClick={copyLink}>Copy Challenge Page Link</button>
      <a
        target="_blank"
        href="https://www.linkedin.com/showcase/global-summer-challenge/posts/?feedView=all"
      >
        Click here to visit the Meeedley Global Summer Challenge Page
      </a>
      <section className="app_disclaimers">
        <p>
          <b>Disclaimer 1</b> - This program is intended solely for fun and
          interactive engagement. It does not reflect any official academic
          evaluation.
        </p>
        <p>
          <b>Disclaimer 2</b> - This application is developed as part of the
          Global Summer Challenge organized by Meeedly.
        </p>
      </section>
    </div>
  );
}

export default App;
