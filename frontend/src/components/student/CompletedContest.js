import React, { useState, useEffect } from "react";
import axios from "axios";

const CompletedContest = ({ username }) => {
  const [completedContests, setCompletedContests] = useState([]);
  const [contestsData, setContestsData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${username}`);
        setCompletedContests(response.data.completedContest);
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

  return (
    <div>
      <h2>Completed Contests</h2>
      {completedContests.length === 0 ? (
        <p>No contests completed.</p>
      ) : (
        <ul>
          {completedContests.map(contestId => {
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
                <hr />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CompletedContest;
