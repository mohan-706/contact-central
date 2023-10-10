import React, { useEffect, useState } from "react";
import fireDb from "./firebase";
import { Link } from "react-router-dom";
import "./Home.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [data, setData] = useState({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(''); // Store the selected sorting property

  useEffect(() => {
    fireDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    });
    return () => {
      setData({});
    };
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the contact?")) {
      fireDb.child(`contacts/${id}`).remove((err) => {
        if (err) {
          toast.error(err);
        } else {
          toast.success("Contact Deleted Successfully");
        }
      });
    }
  };

  const handleReset = () => {
    fireDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    });
  };

  const handleSearch = (search) => {
    fireDb
      .child("contacts")
      .orderByChild("name")
      .equalTo(search)
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          const data = snapshot.val();
          setData(data);
        } else {
          setData({});
        }
      });
    setSearch('');
  };

  const handleChange = (e) => {
    const selectedSortBy = e.target.value;
    setSortBy(selectedSortBy);
    if (selectedSortBy !== "Please Select") {
      const sortedData = Object.entries(data)
        .sort((a, b) => {
          // Convert to lowercase and use localeCompare for string comparison
          return String(a[1][selectedSortBy]).toLowerCase().localeCompare(String(b[1][selectedSortBy]).toLowerCase());
        })
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      setData(sortedData);
    }
  };
// const handleChange =(e)=>{
//     const sortedBy=e.target.value;
//     setSortBy(sortedBy);
//     fireDb.child("contact").orderByChild(`${sortedBy}`).on("value",(snapshot)=>{
//         let sortedData=[];
//         snapshot.forEach((snap)=>{
//             sortedData.push(snap.val());
//         })
//         setData(sortedData);
//     })
// }
  return (
    <div style={{ marginTop: "100px" }}>
      <div className="search">
        <>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => handleSearch(search)}>Submit</button>
        </>
        <button className='btn-reset' onClick={() => handleReset()}>Reset</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>S.No</th>
            <th style={{ textAlign: "center" }}>Pic</th>
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Email</th>
            <th style={{ textAlign: "center" }}>Contact</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((id, index) => {
            return (
              <tr key={id}>
                <th scope="row">{index + 1}</th>
                <img src={data[id].picture} alt="Profile Pic" />
                <td>{data[id].name}</td>
                <td>{data[id].email}</td>
                <td>{data[id].contact}</td>
                <td>
                  <div className="btns">
                    <Link to={`/update/${id}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button className="btn btn-delete" onClick={() => handleDelete(id)}>Delete</button>
                    <Link to={`/view/${id}`}>
                      <button className="btn btn-view">View</button>
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <label>Sort By: </label>
      <select className="dropdown" value={sortBy} onChange={handleChange}>
        <option>Please Select</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="contact">Contact</option>
      </select>
    </div>
  )
}

export default Home;
