import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ username }) => {
  const [registeredContests, setRegisteredContests] = useState([]);
  const [contestsData, setContestsData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${username}`);
        setRegisteredContests(response.data.registeredContest);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchContestDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/contests");
        setContestsData(response.data);
      } catch (error) {
        console.error("Error fetching contest details:", error);
      }
    };

    fetchUserData();
    fetchContestDetails();
  }, [username]);

  const handleCompleted = async (contestId) => {
    try {
      await axios.post(`http://localhost:5000/user/removecontest/${username}`, { contestId });
      setRegisteredContests(prevContests => prevContests.filter(id => id !== contestId));
    } catch (error) {
      console.error("Error removing contest:", error);
    }
  };

  return (
    <div>
      <h2>Registered Contests</h2>
      {registeredContests.length === 0 ? (
        <p>No contests registered.</p>
      ) : (
        <ul>
          {registeredContests.map(contestId => {
            const contest = contestsData.find(contest => contest._id === contestId);
            if (!contest) {
              return (
                <li key={contestId}>
                  <p>Contest not found.</p>
                </li>
              );
            }
            return (
              <li key={contest._id}>
                <h4>{contest.contestName}</h4>
                <p>Organized By: {contest.organisedBy}</p>
                <p>Registration Start Date: {contest.registrationStartDate}</p>
                <p>Registration End Date: {contest.registrationEndDate}</p>
                <p>Registration Link: <a href={contest.registrationLink}>{contest.registrationLink}</a></p>
                <button onClick={() => handleCompleted(contestId)}>Completed</button>
                <hr />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
