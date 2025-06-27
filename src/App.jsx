import "./App.css";
import config from "./config";
import meeedly from "./assets/meeedly_logo.jfif";
import global from "./assets/global_summer_challenge_logo.jfif";
import colin from "./assets/colin.jfif";
import zach from "./assets/zach.jfif";
import charlene from "./assets/charlene.jpeg";
import gayatri from "./assets/Gayatri.jpg";
import ish from "./assets/ish.jfif";

import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { useState, useEffect } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";

function App() {
  const [voted, setVoted] = useState(
    localStorage.getItem("hasVoted") === "true"
  );
  const [userVote, setUserVote] = useState(
    localStorage.getItem("userVote") || null
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [showFailedCopied, setFailedShowCopied] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const currentUrl = window.location.href;

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
    {
      name: "Group G",
      value: 1,
    },
    {
      name: "Group H",
      value: 1,
    },
    {
      name: "Group I",
      value: 1,
    },
    {
      name: "Group J",
      value: 1,
    },
    {
      name: "Group K",
      value: 1,
    },
    {
      name: "Group L",
      value: 1,
    },
  ]);

  const allGroups = [
    "Group A",
    "Group B",
    "Group C",
    "Group D",
    "Group E",
    "Group F",
    "Group G",
    "Group H",
    "Group I",
    "Group J",
    "Group K",
    "Group L",
  ];

  const COLORS = [
    "#4A90E2", // Blue for Software Engineering
    "#50C878", // Green for Business Studies
    "#FFD700", // Yellow for Finance
    "#FF6B6B", // Red for Medical Studies
    "#9B59B6", // Purple for Engineering
    "#FF8C42", // Orange for Physics
    "#8B4513", // Browk for Calculus
    "#FFC0CB", // Pink for Biochem
    "#808080", // Gray for Accounting
    "#F5F5DC", // Beige for CS
    "#D2B48C", // Tan for Stats
    "#800000", //  Maroon for Law
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
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  function checkRes(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  function getData() {
    return fetch(`${config.API_URL}/votes`).then(checkRes).catch(console.error);
  }

  function addVote(name) {
    return fetch(`${config.API_URL}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(checkRes);
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Take a look at this awesome site:",
          url: currentUrl,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(currentUrl);
        setFallbackUsed(true);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  // Remove previous vote from backend
  function removeVote(name) {
    return fetch(`${config.API_URL}/votes/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(checkRes);
  }

  const handleVote = () => {
    if (!selectedSubject) {
      alert("Please select a subject before voting!");
      return;
    }

    if (!voted) {
      addVote(selectedSubject)
        .then(() => {
          setVoted(true);
          setUserVote(selectedSubject);
          localStorage.setItem("hasVoted", "true");
          localStorage.setItem("userVote", selectedSubject);
          // Fetch updated data from backend after voting
          getData().then((res) => {
            const resMap = Object.fromEntries(
              res.map((item) => [item.name, item])
            );
            const merged = allGroups.map((name) => ({
              name,
              value: resMap[name]?.value ?? 0,
            }));
            setData(merged);
          });
          alert(`Thank you for voting for ${getDisplayName(selectedSubject)}!`);
        })
        .catch((err) => {
          console.error("Failed to vote:", err);
          alert("Failed to vote. Please try again.");
        });
    } else {
      alert("You have already voted! Use 'Reset Vote' to change your vote.");
    }
  };

  const resetVote = () => {
    if (voted && userVote) {
      // Remove the previous vote from backend
      removeVote(userVote)
        .then(() => {
          setVoted(false);
          setUserVote(null);
          setSelectedSubject("");
          localStorage.setItem("hasVoted", "false");
          localStorage.removeItem("userVote");
          // Fetch updated data from backend after removing vote
          getData().then((res) => {
            const resMap = Object.fromEntries(
              res.map((item) => [item.name, item])
            );
            const merged = allGroups.map((name) => ({
              name,
              value: resMap[name]?.value ?? 0,
            }));
            setData(merged);
          });
          alert("Your vote has been reset. You can now vote again!");
        })
        .catch((err) => {
          console.error("Failed to reset vote:", err);
          // Still allow local reset even if backend fails
          setVoted(false);
          setUserVote(null);
          setSelectedSubject("");
          localStorage.setItem("hasVoted", "false");
          localStorage.removeItem("userVote");
          alert("Vote reset locally. You can vote again!");
        });
    } else {
      alert("You haven't voted yet!");
    }
  };

  const getDisplayName = (groupName) => {
    const displayNames = {
      "Group A": "Software Engineering",
      "Group B": "Business Studies",
      "Group C": "Finance",
      "Group D": "Medical Studies",
      "Group E": "Electrical Engineering",
      "Group F": "Physics",
      "Group G": "Calculus",
      "Group H": "BioChemistry",
      "Group I": "Accounting",
      "Group J": "Computer Science",
      "Group K": "Statistics",
      "Group L": "Law",
    };
    return displayNames[groupName] || groupName;
  };

  const getIcon = (groupName) => {
    const icons = {
      "Group A": "💻", // Software Engineering
      "Group B": "📊", // Business Studies
      "Group C": "💰", // Finance
      "Group D": "🩺", // Medical Studies
      "Group E": "⚙️", // Electrical Engineering
      "Group F": "🔬", // Physics
      "Group G": "➗", //Calculus
      "Group H": "🧬", //BioChemistry
      "Group I": "📒", //Accounting
      "Group J": "🖥️", //Computer Science
      "Group K": "📈", //Statistics
      "Group L": "⚖️", //Law
    };
    return icons[groupName] || "";
  };

  const getTotalVotes = () => {
    return data.reduce((total, item) => total + Number(item.value), 0);
  };

  const getSortedData = () => {
    return [...data]
      .map((item) => ({
        ...item,
        displayName: getDisplayName(item.name),
        icon: getIcon(item.name),
      }))
      .sort((a, b) => Number(b.value) - Number(a.value));
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
        // Ensure all groups are present, even if backend omits some
        const allGroups = [
          "Group A",
          "Group B",
          "Group C",
          "Group D",
          "Group E",
          "Group F",
          "Group G",
          "Group H",
          "Group I",
          "Group J",
          "Group K",
          "Group L",
        ];
        const resMap = Object.fromEntries(res.map((item) => [item.name, item]));
        const merged = allGroups.map((name) => ({
          name,
          value: resMap[name]?.value ?? 0,
        }));
        setData(merged);
      })
      .catch((err) => {
        console.error("Failed to fetch votes:", err);
        // Keep existing data as fallback
      });
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__logos">
          <img src={meeedly} alt="Meeedly Logo" className="logo" />
          <div className="global-challenge">
            <img
              src={global}
              alt="Global Summer Challenge Logo"
              className="logo"
            />
          </div>
        </div>
      </header>

      <main className="app__main">
        <h1 className="app__title">Favorite Subject</h1>
        <h2 className="app__subtitle">Vote Your Interest!</h2>

        <div className="app__content-grid">
          <div className="app__chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.map((d) => ({ ...d, value: Number(d.value) }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
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

            <div className="chart__legend">
              {data.map((entry, index) => (
                <div key={entry.name} className="legend__item">
                  <div
                    className="legend__color"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{getDisplayName(entry.name)}</span>
                  <span className="legend__percentage">
                    {getTotalVotes() > 0
                      ? Math.round(
                          (Number(entry.value) / getTotalVotes()) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="app__stats">
            <div className="stats__card">
              <h3>Total Votes:</h3>
              <div className="total-votes">{getTotalVotes()}</div>
            </div>

            <div className="stats__card top-subjects-card">
              <h3>Top 5 Subjects</h3>
              <div className="top-subjects">
                {getSortedData()
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={item.name} className="subject-item">
                      <span className="subject-rank">{index + 1}</span>
                      <span className="subject-icon">{item.icon}</span>
                      <span className="subject-name">{item.displayName}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="app__voting">
          <h3>Favorite subject</h3>

          {/* Show voting status */}
          {voted && (
            <div className="voting-status">
              <p>
                <strong>✅ You voted for: {getDisplayName(userVote)}</strong>
              </p>
              <p>Use "Reset Vote" below to change your vote.</p>
            </div>
          )}

          <div className="voting__options">
            {data.map((item) => (
              <label key={item.name} className="radio-option">
                <input
                  type="radio"
                  name="subject"
                  value={item.name}
                  checked={selectedSubject === item.name}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={voted}
                />
                <span className="radio-custom"></span>
                <span>{getDisplayName(item.name)}</span>
              </label>
            ))}
          </div>

          <div className="voting__actions">
            <button
              className="submit-btn"
              onClick={handleVote}
              disabled={voted || !selectedSubject}
            >
              Submit
            </button>

            {voted && (
              <button className="reset-btn" onClick={resetVote}>
                Reset Vote
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="app__footer">
        <div className="footer__content">
          <p>&copy; 2025 Meeedly</p>
        </div>

        <div className="footer__actions">
          <button onClick={handleShare} className="link-btn">
            Share This Page
          </button>

          {fallbackUsed && (
            <div className="mt-4">
              <p className="mb-2 text-gray-700">Or share via:</p>
              <div className="flex gap-2">
                <FacebookShareButton url={currentUrl}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={currentUrl} title="Check this out!">
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </div>
            </div>
          )}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/showcase/global-summer-challenge/posts/?feedView=all"
            className="linkedin-btn"
          >
            Click here to visit the Meeedly Global Summer Challenge Page
          </a>
        </div>
      </footer>

      {showCopied && (
        <div className="copied-message">Link copied to clipboard!</div>
      )}
      {showFailedCopied && (
        <div className="copied-message">Failed to copy link.</div>
      )}

      <section className="members">
        <div className="member">
          <img src={zach} className="member__img"></img>
          <h3 className="member__title">Leader</h3>
          <p className="member__name">Zach McMillan</p>
        </div>
        <div className="member">
          <img src={colin} className="member__img"></img>
          <h3 className="member__title">Lead Programmer</h3>
          <p className="member__name">Colin Strasser</p>
        </div>
        <div className="member">
          <img src={charlene} className="member__img"></img>
          <h3 className="member__title">Lead Marketer</h3>
          <p className="member__name">Charlene Zhang</p>
        </div>
        <div className="member">
          <img src={ish} className="member__img"></img>
          <h3 className="member__title">Advisor</h3>
          <p className="member__name">Ishwarya Rajkumar</p>
        </div>
        <div className="member">
          <img src={gayatri} className="member__img"></img>
          <h3 className="member__title">Member</h3>
          <p className="member__name">Gayatri Talluri</p>
        </div>
        <div className="member">
          <img src={global} className="member__img"></img>
          <h3 className="member__title">Member</h3>
          <p className="member__name">Havva Damla Şentürk</p>
        </div>
      </section>

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
