import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import { BsThreeDots } from "react-icons/bs";


function App() {
  const [inputData, setInputData] = useState({
    callDateFrom: "",
    callDateTo: "",
    phoneNo: "",
    volunteerNumber: "",
    campaignId: "",
    agentId: "",
  });

  const [inputArr, setInputArr] = useState([]);
  const [allItems, setAllItems] = useState([])
  const [filteredData,setFilteredData]  = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = () =>{
    let tempInputData = {...inputData};
    let tempAllItems = [...allItems];
    if(tempInputData.phoneNo){
      let tempFilteredData =  tempAllItems.filter((data)=> data.phoneNo === tempInputData.phoneNo);
      setInputArr(tempFilteredData);
    } else{
      setInputArr(allItems)
    }
  }

  const getData = () => {
    axios
      .get("http://localhost:8000/api/callRecordings")
      .then((response) => {
        setAllItems(response.data);
        setInputArr(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Call Recordings", 10, 10);
    doc.autoTable({
      head: [["Phone No", "Call Date", "Recording File", "Camp Name", "Agent Id"]],
      body: inputArr.map((info) => [
        info.phoneNo,
        info.callDate,
        info.recordingFile,
        info.campName,
        info.agentId,
      ]),
    });
    doc.save("call_recordings.pdf");
  };

  const handleCancel = () => {
    setInputData({
      callDateFrom: "",
      callDateTo: "",
      phoneNo: "",
      volunteerNumber: "",
      campaignId: "",
      agentId: "",
    });
    setInputArr(allItems);
  };

  // Fetch data on initial load

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inputArr.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container-fluid bg-white text-dark">
      <header className="header" style={{ backgroundColor: "#2d285f" }}>
        <h1 className="m-0 p-1" style={{ color: "white" }}>
          Manage Call Recording
        </h1>
      </header>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="form-group">
            <label className="fw-bold">Call Date From:</label>
            <input
              type="date"
              className="form-control border border-dark border-2"
              name="callDateFrom"
              value={inputData.callDateFrom}
              onChange={handleChange}
              placeholder="Call Date From"
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label className="fw-bold">Call Date To:</label>
            <input
              type="date"
              className="form-control border border-dark border-2"
              name="callDateTo"
              value={inputData.callDateTo}
              onChange={handleChange}
              placeholder="Call Date To"
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label className="fw-bold">Phone No:</label>
            <input
              type="text"
              className="form-control border border-dark border-2"
              name="phoneNo"
              value={inputData.phoneNo}
              onChange={handleChange}
              placeholder="Phone No"
            />
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="form-group">
            <label className="fw-bold">Volunteer Number:</label>
            <input
              type="text"
              className="form-control border border-dark border-2"
              name="volunteerNumber"
              value={inputData.volunteerNumber}
              onChange={handleChange}
              placeholder="Volunteer Number"
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label className="fw-bold">Campaign Id:</label>
            <select
              className="form-control border border-dark border-2"
              name="campaignId"
              value={inputData.campaignId}
              onChange={handleChange}
            >
              <option value="">Select Campaign Id</option>
              {Array.from({ length: 10 }, (_, index) => {
                const campaignId = 801 + index;
                return (
                  <option key={campaignId} value={campaignId}>
                    {campaignId}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label className="fw-bold">Agent Id:</label>
            <input
              type="text"
              className="form-control border border-dark border-2"
              name="agentId"
              value={inputData.agentId}
              onChange={handleChange}
              placeholder="Agent Id"
            />
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="form-group">
            <label className="fw-bold">Response No:</label>
            <input
              type="text"
              className="form-control border border-dark border-2"
              name="phoneNo"
              value={inputData.ResponseNo}
              onChange={handleChange}
              placeholder="Response No"
            />
          </div>
        </div>
      </div>
      <div className="button-container text-end">
        <button
          className="btn btn-primary mx-2 mt-4"
          style={{ backgroundColor: "#2d285f" }}
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className="btn btn-secondary mx-2 mt-4"
          style={{ backgroundColor: "#2d285f" }}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary mx-2 mt-4"
          style={{ backgroundColor: "#2d285f" }}
          onClick={handleExport}
        >
          Export
        </button>
      </div>
      <table className="table table-bordered mt-4">
  <tbody>
    <tr>
      <th className="table-header border border-dark border-2">Action</th>
      <th className="table-header border border-dark border-2">Phone No</th>
      <th className="table-header border border-dark border-2">Call Date</th>
      <th className="table-header border border-dark border-2">Recording File</th>
      <th className="table-header border border-dark border-2">Camp Name</th>
      <th className="table-header border border-dark border-2">Agent Id</th>
    </tr>
    {currentItems.map((info, ind) => (
      <tr key={ind}>
        <td className="border border-dark border-2">
          <button className="btn btn-link p-0">
            <BsThreeDots />
          </button>
        </td>
        <td className="border border-dark border-2">{info.phoneNo}</td>
        <td className="border border-dark border-2">{info.callDateTo}</td>
        <td className="border border-dark border-2">{info.recordingFile}</td>
        <td className="border border-dark border-2">{info.campName}</td>
        <td className="border border-dark border-2">{info.agentId}</td>
      </tr>
    ))}
  </tbody>
</table>


      <nav>
        <ul className="pagination justify-content-center">
          {inputArr.length > itemsPerPage &&
            Array.from({ length: Math.ceil(inputArr.length / itemsPerPage) }, (_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}

export default App;
