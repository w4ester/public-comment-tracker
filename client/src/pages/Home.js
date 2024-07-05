import React, { useState } from 'react';
import { getBillsByAddress } from '../services/api';

function Home() {
  const [address, setAddress] = useState('');
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fetchedBills = await getBillsByAddress(address);
      setBills(fetchedBills);
    } catch (err) {
      setError('Error fetching bills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find Bills Open for Public Comment</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="Enter your address"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {bills.map(bill => (
          <li key={bill.id}>
            <h3>{bill.title}</h3>
            <p>Identifier: {bill.identifier}</p>
            <p>Jurisdiction: {bill.jurisdiction}</p>
            <p>Last Action: {bill.lastAction} ({bill.lastActionDate})</p>
            <p>Sponsors: {bill.sponsors.join(', ')}</p>
            <p>Abstract: {bill.abstract}</p>
            <p>Sources: 
              {bill.sources.map((source, index) => (
                <a key={index} href={source} target="_blank" rel="noopener noreferrer">Source {index + 1}</a>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
