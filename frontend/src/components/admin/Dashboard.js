import React, { useState, useEffect } from "react";
import axios from "axios";
import './Dashboard.css';

const Dashboard = () => {
  const [contests, setContests] = useState([]);
  const [clickedContest, setClickedContest] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/contests");
        setContests(response.data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };
    fetchContests();
  }, []);

  const handleNotInterested = async (contestId) => {
    setClickedContest(contestId);
  };

  return (
    <div className="dashboard-container">
      <h2>Contests</h2>
      {contests.map(contest => (
        <div key={contest._id} className="contest-item">
          <div className="contest-details">
            <p>{contest.contestName} - {contest.organisedBy}</p>
            <div className="button-container">
              <button onClick={() => handleNotInterested(contest._id)}>Not Interested</button>
            </div>
            {clickedContest === contest._id && contest.notInterestedStudents && contest.notInterestedStudents.length > 0 &&
              <ul className="user-list">
                {contest.notInterestedStudents.map((username, index) => (
                  <li key={index}>{username}</li>
                ))}
              </ul>
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
