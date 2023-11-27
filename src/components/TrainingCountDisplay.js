
import React, { useState ,useEffect} from "react";

function TrainingCountDisplay({ trainingData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  function countTrainings(data) {
    const trainingCounts = {};
    data.forEach((person) => {
      person.completions.forEach((training) => {
        trainingCounts[training.name] =
          (trainingCounts[training.name] || 0) + 1;
      });
    });
    return trainingCounts;
  }

  const trainingCounts = countTrainings(trainingData);

  // Calculate the total number of pages
  const totalTrainingCount = Object.keys(trainingCounts).length;
  const totalPages = Math.ceil(totalTrainingCount / itemsPerPage);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Get the training entries for the current page
  const trainingEntries = Object.entries(trainingCounts).slice(
    startIndex,
    endIndex
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const downloadJSON = () => {
    const dataToDownload = JSON.stringify(trainingCounts, null, 2);
    const blob = new Blob([dataToDownload], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trainingCounts.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Automatically trigger the download on component load
  useEffect(() => {
    downloadJSON();
  }, []);


  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Training</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {trainingEntries.map(([training, count]) => (
            <tr key={training}>
              <td>{training}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </button>
          <span className="page-count">
            {`Showing ${startIndex + 1}-${Math.min(
              endIndex,
              totalTrainingCount
            )} of ${totalTrainingCount}`}
          </span>
          <button
            className="pagination-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </table>
    </div>
  );
}

export default TrainingCountDisplay;
