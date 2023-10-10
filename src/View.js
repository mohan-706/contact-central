import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fireDb from "./firebase";
import "./View.css"; // Import the CSS file

const View = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fireDb
      .child(`contacts/${id}`)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUser({ ...snapshot.val() });
        } else {
          setUser({});
        }
      });
  }, [id]);

  return (
    <div className="view-card">
      <div className="view-header">User Contact Details</div>
      <div className="view-content">
        <div className="view-image">
          <img src={user.picture} alt="Profile Pic" />
        </div>
        <div className="view-details">
          <strong>Name:</strong>
          <span>{user.name}</span>
          <strong>Email:</strong>
          <span>{user.email}</span>
          <strong>Contact:</strong>
          <span>{user.contact}</span>
        </div>
      </div>
    </div>
  );
};

export default View;
