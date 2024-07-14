import React, { useState } from "react";
import axios from "axios";
import './AddContest.css';

const AddContest = () => {
  const [contestData, setContestData] = useState({
    contestName: "",
    organisedBy: "",
    registrationStartDate: "",
    registrationEndDate: "",
    registrationLink: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedStartDate = formatDate(contestData.registrationStartDate);
      const formattedEndDate = formatDate(contestData.registrationEndDate);
      const formattedContestData = {
        ...contestData,
        registrationStartDate: formattedStartDate,
        registrationEndDate: formattedEndDate
      };
      await axios.post("http://localhost:5000/addcontest", formattedContestData);
      alert("Contest details saved successfully!");
      setContestData({
        contestName: "",
        organisedBy: "",
        registrationStartDate: "",
        registrationEndDate: "",
        registrationLink: ""
      });
    } catch (error) {
      console.error("Error saving contest details:", error);
      alert("Failed to save contest details. Please try again.");
    }
  };
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>Contest Name: <input type="text" name="contestName" value={contestData.contestName} onChange={handleChange} required />
        </label><br />
        <label>Organised By:<input type="text" name="organisedBy" value={contestData.organisedBy} onChange={handleChange} required/>
        </label><br />
        <label>Registration Start Date:<input type="date" name="registrationStartDate" value={contestData.registrationStartDate} 
        onChange={handleChange} required/></label><br />
        <label>Registration End Date:<input type="date" name="registrationEndDate" value={contestData.registrationEndDate}
        onChange={handleChange} required/></label><br />
        <label>Registration Link:<input type="url" name="registrationLink" value={contestData.registrationLink} onChange={handleChange}
        required/></label><br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddContest;
