import React, { useState , useEffect} from 'react';

function ExpiringTrainings({ trainingData, specifiedDate }) {
  const itemsPerPage = 12; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);

  const getExpiringTrainings = () => {
    const results = [];

    trainingData.forEach(person => {
      person.completions.forEach(training => {
        const completionDate = new Date(training.timestamp);
        const oneMonthFromSpecifiedDate = new Date(specifiedDate);
        oneMonthFromSpecifiedDate.setMonth(oneMonthFromSpecifiedDate.getMonth() + 1);

        if (completionDate <= specifiedDate) {
          // Training has expired
          results.push({
            personName: person.name,
            trainingName: training.name,
            expired: true,
          });
        } else if (completionDate <= oneMonthFromSpecifiedDate) {
          // Training will expire within one month
          results.push({
            personName: person.name,
            trainingName: training.name,
            expiresSoon: true,
          });
        }
      });
    });

    return results;
  };

  const expiringTrainings = getExpiringTrainings();

  // Calculate the total number of pages
  const totalPages = Math.ceil(expiringTrainings.length / itemsPerPage);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const itemsToDisplay = expiringTrainings.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const downloadJSON = () => {
    const dataToDownload = JSON.stringify(expiringTrainings, null, 2);
    const blob = new Blob([dataToDownload], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expiringTrainings.json';
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
            <th>Person Name</th>
            <th>Training Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((result, index) => (
            <tr key={index}>
              <td>{result.personName}</td>
              <td>{result.trainingName}</td>
              <td>{result.expired ? 'Expired' : 'Expires Soon'}</td>
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
          expiringTrainings.length
        )} of ${expiringTrainings.length}`}
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

export default ExpiringTrainings;
