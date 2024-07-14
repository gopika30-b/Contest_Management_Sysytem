import React, { useState, useEffect } from "react";
import axios from "axios";

const Contest = ({ username }) => {
  const [contests, setContests] = useState([]);

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

  const handleRegisterInterest = async (contestId) => {
    try {
      await axios.post(`http://localhost:5000/contests/register/${contestId}`, { username });
      const response = await axios.get("http://localhost:5000/contests");
      setContests(response.data);
    } catch (error) {
      console.error("Error registering interest:", error);
    }
  };

  const handleExpressDisinterest = async (contestId) => {
    try {
      await axios.post(`http://localhost:5000/contests/notinterested/${contestId}`, { username });
      const response = await axios.get("http://localhost:5000/contests");
      setContests(response.data);
    } catch (error) {
      console.error("Error expressing disinterest:", error);
    }
  };

  return (
    <div>
      <h2>Contests</h2>
      {contests.map(contest => {
        const isNotInterested = contest.notInterestedStudents.includes(username);
        const isRegistered = contest.registeredStudents.includes(username);
        if (!isNotInterested && !isRegistered) {
          return (
            <div key={contest._id}>
              <p>Contest Name: {contest.contestName}</p>
              <p>Organised By: {contest.organisedBy}</p>
              <p>Registration Start Date: {contest.registrationStartDate}</p>
              <p>Registration End Date: {contest.registrationEndDate}</p>
              <p>Registration Link: <a href={contest.registrationLink}>{contest.registrationLink}</a></p>
              <button onClick={() => handleRegisterInterest(contest._id)}>Register</button>
              <button onClick={() => handleExpressDisinterest(contest._id)}>Not Interested</button>
              <hr />
            </div>
          );
        } else {
          return null; 
        }
      })}
    </div>
  );
};

export default Contest;
