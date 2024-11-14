import { useState } from "react";

// DANGEROUS: These queries are directly visible in browser dev tools
const PREDEFINED_QUERIES = {
  getAllUsers: `SELECT * FROM users`,
  getUserEmails: `SELECT id, email FROM users`,
  getUsersAlphabetically: `SELECT * FROM users ORDER BY last_name`,
  getEmailCount: `SELECT COUNT(*) FROM users`,
  getTableInfo: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'`,
};

const ExposedSQLExample = () => {
  const [selectedQuery, setSelectedQuery] = useState<string>("getAllUsers");
  const [results, setResults] = useState<any[]>([]);

  // These connection details would be visible in the browser
  const DB_CONFIG = {
    host: "dpg-csqq33ij1k6c73c0vbbg-a",
    database: "disc_demo",
    user: "disc_demo_user",
    // NEVER put credentials in frontend code!
    password: "s2cYTyGqcwPOj4XB6eajC6z6hzJCc9Zp",
  };

  const executeQuery = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/execute-sql`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              PREDEFINED_QUERIES[
                selectedQuery as keyof typeof PREDEFINED_QUERIES
              ],
            config: DB_CONFIG, // NEVER send this!
          }),
        }
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Query failed:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <h2 className="font-bold text-yellow-800">🔍 Developer Note:</h2>
        <p className="text-yellow-800">
          Open Chrome DevTools (F12) and look at the Sources tab to see all
          these SQL queries and database credentials exposed in the frontend
          code!
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Database Query Interface</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">
            Select Query:
          </label>
          <select
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            {Object.keys(PREDEFINED_QUERIES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">
            SQL to be executed:
          </label>
          <pre className="bg-gray-50 p-3 rounded border text-black">
            {
              PREDEFINED_QUERIES[
                selectedQuery as keyof typeof PREDEFINED_QUERIES
              ]
            }
          </pre>
        </div>

        <button
          onClick={executeQuery}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Query
        </button>

        {results.length > 0 && (
          <div className="mt-6 text-black">
            <h3 className="font-bold mb-2">Results:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(results[0]).map((key) => (
                      <th key={key} className="border px-4 py-2 text-left">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value: any, j) => (
                        <td key={j} className="border px-4 py-2">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
        <h3 className="font-bold text-red-700">Security Risks:</h3>
        <ul className="list-disc ml-5 text-red-700">
          <li>SQL queries visible in source code</li>
          <li>Database credentials exposed</li>
          <li>Table structure revealed</li>
          <li>Sensitive data potentially exposed</li>
        </ul>
      </div>
    </div>
  );
};

export default ExposedSQLExample;
