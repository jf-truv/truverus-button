import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import excel from 'excel4node';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

async function getCompanyNames() {
    try {
        const pool = await mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: 'Hw177pL_xYz9',
            database: 'ssot'
        });

        const connection = await pool.getConnection();

        const [companyNames] = await connection.query(`
            SELECT DISTINCT CompanyName FROM company;
        `);

        connection.release();

        return companyNames.map((company) => company.CompanyName);
    } catch (error) {
        throw error;
    }
}

async function getSurveyIDs(companyName) {
    try {
        const pool = await mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: 'Hw177pL_xYz9',
            database: 'ssot'
        });

        const connection = await pool.getConnection();

        const [surveyIDs] = await connection.query(`
            SELECT DISTINCT SurveyID FROM surveys
            JOIN company ON surveys.CompanyID = company.CompanyID
            WHERE CompanyName = ?;
        `, [companyName]);

        connection.release();

        return surveyIDs.map((survey) => survey.SurveyID);
    } catch (error) {
        throw error;
    }
}

app.get('/companyNames', async (req, res) => {
    try {
        const companyNames = await getCompanyNames();
        res.json(companyNames);
    } catch (error) {
        console.error('Error fetching company names:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/surveyIDs', async (req, res) => {
    try {
        const companyName = req.query.company;
        if (!companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        const surveyIDs = await getSurveyIDs(companyName);
        res.json(surveyIDs);
    } catch (error) {
        console.error('Error fetching survey IDs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/surveyData', async (req, res) => {
    try {
        const selectedSurveyId = req.body.selectedSurveyId;
        if (!selectedSurveyId) {
            return res.status(400).json({ error: 'Selected Survey ID is required' });
        }

        const pool = await mysql.createPool({
            host: '127.0.0.1',
            user: 'root',
            password: 'Hw177pL_xYz9',
            database: 'ssot'
        });

        const connection = await pool.getConnection();

        const [participantData] = await connection.query(`
            SELECT DISTINCT
                survey_has_answer.ParticipantID,
                questions.SurveyID,
                participant.Email,
                participant.FirstName,
                participant.LastName
            FROM 
                survey_has_answer 
            JOIN 
                questions ON survey_has_answer.QuestionID = questions.QuestionID 
            LEFT JOIN 
                participant ON survey_has_answer.ParticipantID = participant.ParticipantID
            JOIN 
                surveys ON surveys.SurveyID = questions.SurveyID
            JOIN 
                company ON company.CompanyID = surveys.CompanyID
            WHERE 
                surveys.SurveyID = ?;
        `, [selectedSurveyId]);

        const [legendQA] = await connection.query(`
            SELECT DISTINCT
                questions.SurveyID,
                questions.QuestionID,
                questions.QuestionText,
                survey_has_answer.OptionID,
                options.OptionText
            FROM 
                survey_has_answer 
            JOIN 
                questions ON survey_has_answer.QuestionID = questions.QuestionID 
            LEFT JOIN 
                options ON survey_has_answer.OptionID = options.OptionID 
            JOIN 
                surveys ON surveys.SurveyID = questions.SurveyID
            JOIN 
                company ON company.CompanyID = surveys.CompanyID
            WHERE 
                surveys.SurveyID = ?;
        `, [selectedSurveyId]);

        const [surveyOptions] = await connection.query(`
            SELECT
                questions.SurveyID,
                surveys.SurveyDate,
                questions.QuestionID,
                questions.QuestionText,
                survey_has_answer.ParticipantID,
                survey_has_answer.OptionID,
                options.OptionText
            FROM 
                survey_has_answer 
            JOIN 
                questions ON survey_has_answer.QuestionID = questions.QuestionID 
            LEFT JOIN 
                options ON survey_has_answer.OptionID = options.OptionID 
            JOIN 
                surveys ON surveys.SurveyID = questions.SurveyID
            JOIN 
                company ON company.CompanyID = surveys.CompanyID
            WHERE 
                surveys.SurveyID = ? AND survey_has_answer.OptionID IS NOT NULL
        `, [selectedSurveyId]);

        const [surveyText] = await connection.query(`
            SELECT 
                questions.SurveyID,
                surveys.SurveyDate,
                questions.QuestionID,
                questions.QuestionText,
                survey_has_answer.ParticipantID,
                survey_has_answer.ResponseText
            FROM 
                survey_has_answer 
            JOIN 
                questions ON survey_has_answer.QuestionID = questions.QuestionID 
            LEFT JOIN 
                options ON survey_has_answer.OptionID = options.OptionID 
            JOIN 
                surveys ON surveys.SurveyID = questions.SurveyID
            JOIN 
                company ON company.CompanyID = surveys.CompanyID
            WHERE 
                surveys.SurveyID = ? AND survey_has_answer.ResponseText IS NOT NULL;
        `, [selectedSurveyId]);

        const responseData = { participantData, legendQA, surveyOptions, surveyText };

        // Create an instance of a Workbook class
        const wb = new excel.Workbook();

        // Function to add data to a worksheet
        const addDataToSheet = (sheetName, data, headers) => {
            const ws = wb.addWorksheet(sheetName);
            headers.forEach((header, index) => {
                ws.cell(1, index + 1).string(header);
            });
            data.forEach((row, rowIndex) => {
                headers.forEach((header, colIndex) => {
                    const cellValue = row[header] || '';
                    if (typeof cellValue === 'string') {
                        ws.cell(rowIndex + 2, colIndex + 1).string(cellValue);
                    } else if (typeof cellValue === 'number') {
                        ws.cell(rowIndex + 2, colIndex + 1).number(cellValue);
                    } else {
                        ws.cell(rowIndex + 2, colIndex + 1).string(cellValue.toString());
                    }
                });
            });
        };

        // Add data to individual sheets
        addDataToSheet('Participant Data', participantData, ['ParticipantID', 'SurveyID', 'Email', 'FirstName', 'LastName']);
        addDataToSheet('Legend QA', legendQA, ['SurveyID', 'QuestionID', 'QuestionText', 'OptionID', 'OptionText']);
        addDataToSheet('Survey Options', surveyOptions, ['SurveyID', 'SurveyDate', 'QuestionID', 'QuestionText', 'ParticipantID', 'OptionID', 'OptionText']);
        addDataToSheet('Survey Text', surveyText, ['SurveyID', 'SurveyDate', 'QuestionID', 'QuestionText', 'ParticipantID', 'ResponseText']);
        console.log("Participant Data: ", participantData)
        console.log("Legend QA: ", legendQA)
        console.log("Survey Options: ", surveyOptions)
        console.log("Survey Text: ", surveyText)

        // Write the Excel file to a buffer
        wb.write('SurveyData.xlsx', res);
        connection.release();
    } catch (error) {
        console.error('Error fetching survey data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 5179;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});