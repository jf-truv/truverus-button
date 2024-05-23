import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
    const [companyNames, setCompanyNames] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [surveyIDs, setSurveyIDs] = useState([]);
    const [selectedSurveyId, setSelectedSurveyId] = useState('');
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        const fetchCompanyNames = async () => {
            try {
                const response = await axios.get('http://localhost:5179/companyNames');
                setCompanyNames(response.data);
            } catch (error) {
                console.error('Error fetching company names:', error);
            }
        };

        fetchCompanyNames();
    }, []);

    useEffect(() => {
        const fetchSurveyIDs = async () => {
            try {
                if (selectedCompany) {
                    const response = await axios.get('http://localhost:5179/surveyIDs', {
                        params: { company: selectedCompany }
                    });
                    setSurveyIDs(response.data);
                } else {
                    setSurveyIDs([]);
                }
            } catch (error) {
                console.error('Error fetching survey IDs:', error);
            }
        };

        fetchSurveyIDs();
    }, [selectedCompany]);

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    const handleSurveyChange = (event) => {
        setSelectedSurveyId(event.target.value);
        // Make a POST request to send selectedSurveyId to the server
        axios.post('http://localhost:5179/surveyData', { selectedSurveyId: event.target.value })
            .then(response => {
                //console.log('Survey data fetched successfully:', JSON.stringify(response.data));
                setResponseData(response.data);
            })
            .catch(error => {
                console.error('Error fetching survey data:', error);
            });
    };

    const handleDownloadExcel = () => {
        axios.post('http://localhost:5179/surveyData', { selectedSurveyId }, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'surveyData.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                console.log("Document: ", document)
            })
            .catch(error => {
                console.error('Error downloading Excel file:', error);
            });
    };

    return (
        <div>
            <h1>Company and Survey Selection</h1>
            <div>
                <label htmlFor="companyDropdown">Select a Company:</label>
                <select id="companyDropdown" value={selectedCompany} onChange={handleCompanyChange}>
                    <option value="">Select Company</option>
                    {companyNames.map((companyName, index) => (
                        <option key={index} value={companyName}>{companyName}</option>
                    ))}
                </select>
            </div>
            {selectedCompany && (
                <div>
                    <label htmlFor="surveyDropdown">Select a Survey ID:</label>
                    <select id="surveyDropdown" value={selectedSurveyId} onChange={handleSurveyChange}>
                        <option value="">Select Survey ID</option>
                        {surveyIDs.map((surveyID, index) => (
                            <option key={index} value={surveyID}>{surveyID}</option>
                        ))}
                    </select>
                </div>
            )}
            
            <div>
                <br/>
                <button onClick={handleDownloadExcel}>Download Excel</button>
            </div>
        </div>
    );
};

export default App;
