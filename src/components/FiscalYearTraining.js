import React , {useEffect} from 'react';

function FiscalYearTraining({ trainingData, trainings, fiscalYearStart, fiscalYearEnd }) {
  const getFiscalYearTrainings = () => {
    let results = {};
    trainings.forEach(trainingName => {
      results[trainingName] = [];
    });

    trainingData.forEach(person => {
      person.completions.forEach(training => {
        if (trainings.includes(training.name) && 
            new Date(training.timestamp) >= fiscalYearStart && 
            new Date(training.timestamp) <= fiscalYearEnd) {
          results[training.name].push(person.name);
        }
      });
    });

    return results;
  };
  const downloadJSON = () => {
    const dataToDownload = JSON.stringify(fiscalYearTrainingResults, null, 2);
    const blob = new Blob([dataToDownload], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fiscalYearTrainings.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Automatically trigger the download on component load
  useEffect(() => {
    downloadJSON();
  }, []);
  const fiscalYearTrainingResults = getFiscalYearTrainings();

  return (
    <div>
     
      <table>
        <thead>
          <tr>
            <th>Training</th>
            <th>Completed By</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fiscalYearTrainingResults).map(([training, completedBy]) => (
            <tr key={training}>
              <td>{training}</td>
              <td>{completedBy.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FiscalYearTraining;
