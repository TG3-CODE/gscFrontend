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
  const [userVote, setUserVote] = useState(
    localStorage.getItem("userVote") || null
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

  // Remove previous vote from backend
  function removeVote(name) {
    return fetch(`${config.API_URL}/votes/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(checkRes);
  }

  const addCount = (groupName) => {
    console.log("Attempting to vote for:", groupName);
    if (!voted) {
      handleVote(groupName);
    } else {
      alert("You have already voted! Use 'Reset Vote' to change your vote.");
    }
  };

  const handleVote = (groupName) => {
    if (!voted) {
      addVote(groupName).then(() => {
        setVoted(true);
        setUserVote(groupName);
        localStorage.setItem("hasVoted", "true");
        localStorage.setItem("userVote", groupName);
        // Fetch updated data from backend after voting
        getData().then((res) => setData(res));
        alert(`Thank you for voting for ${getSubjectName(groupName)}!`);
      }).catch((err) => {
        console.error("Failed to vote:", err);
        alert("Failed to vote. Please try again.");
      });
    }
  };

  const resetVote = () => {
    if (voted && userVote) {
      // Remove the previous vote from backend
      removeVote(userVote).then(() => {
        setVoted(false);
        setUserVote(null);
        localStorage.setItem("hasVoted", "false");
        localStorage.removeItem("userVote");
        // Fetch updated data from backend after removing vote
        getData().then((res) => setData(res));
        alert("Your vote has been reset. You can now vote again!");
      }).catch((err) => {
        console.error("Failed to reset vote:", err);
        // Still allow local reset even if backend fails
        setVoted(false);
        setUserVote(null);
        localStorage.setItem("hasVoted", "false");
        localStorage.removeItem("userVote");
        alert("Vote reset locally. You can vote again!");
      });
    } else {
      alert("You haven't voted yet!");
    }
  };

  const getSubjectName = (groupName) => {
    const subjects = {
      "Group A": "Software Engineering",
      "Group B": "Business Studies", 
      "Group C": "Finance",
      "Group D": "Medical Studies",
      "Group E": "Engineering",
      "Group F": "Physics"
    };
    return subjects[groupName] || groupName;
  };

  const copyLink = () => {
    const link =
      "https://www.linkedin.com/showcase/global-summer-challenge/posts/?feedView=all";
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      })
      .catch(() => {
        setFailedShowCopied(true);
        setTimeout(() => setFailedShowCopied(false), 2000);
      });
  };

  useEffect(() => {
    getData()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to fetch votes:", err);
        // Keep existing data as fallback
      });
  }, []);

  return (
    <div className="app">
      <section className="app__content">
        <img src={meeedly} alt="Meeedly Logo" />
        <img src={global} alt="Global Summer Challenge Logo" />
        <h2>What's the best subject?</h2>
        
        {/* Show voting status */}
        {voted && (
          <div style={{ 
            backgroundColor: "#e8f5e8", 
            padding: "10px", 
            borderRadius: "5px", 
            margin: "10px 0",
            border: "1px solid #4caf50"
          }}>
            <p><strong>✅ You voted for: {getSubjectName(userVote)}</strong></p>
            <p>Use "Reset Vote" below to change your vote.</p>
          </div>
        )}

        {/* Single set of voting buttons */}
        <div className="app__subjects">
          <button
            className="app__subjects_SE"
            onClick={() => addCount("Group A")}
            disabled={voted}
            style={{ opacity: voted ? 0.6 : 1 }}
          >
            Software Engineering
          </button>
          <button
            className="app__subjects_BS"
            onClick={() => addCount("Group B")}
            disabled={voted}
            style={{ opacity: voted ? 0.6 : 1 }}
          >
            Business Studies
          </button>
          <button
            className="app__subjects_F"
            onClick={() => addCount("Group C")}
            disabled={voted}
            style={{ opacity: voted ? 0.6 : 1 }}
          >
            Finance
          </button>
          <button
            className="app__subjects_MS"
            onClick={() => addCount("Group D")}
            disabled={voted}
            style={{ opacity: voted ? 0.6 : 1 }}
          >
            Medical Studies
          </button>
          <button
            className="app__subjects_E"
            onClick={() => addCount("Group E")}
            disabled={voted}
            style={{ opacity: voted ? 0.6 : 1 }}
          >
            Engineering
          </button>
          <button
            className="app__subjects_P"
            onClick={() => addCount("Group F")}
            disabled={voted}
            style={{ opacity: voted ? 0.6 : 1 }}
          >
            Physics
          </button>
        </div>

        {/* Reset vote button */}
        <div style={{ margin: "20px 0" }}>
          <button 
            onClick={resetVote}
            style={{
              backgroundColor: "#ff6b6b",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Reset Vote
          </button>
        </div>
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
        rel="noopener noreferrer"
        href="https://www.linkedin.com/showcase/global-summer-challenge/posts/?feedView=all"
      >
        Click here to visit the Meeedly Global Summer Challenge Page
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
