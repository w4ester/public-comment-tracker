const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.OPENSTATES_API_KEY;
const API_BASE_URL = 'https://v3.openstates.org';

const getBillsByAddress = async (address) => {
  try {
    // In a real application, you would use a geocoding service here
    // For now, we'll use a placeholder for New York
    const lat = 40.7128;
    const lng = -74.0060;

    // First, get the jurisdiction for the given coordinates
    const jurisdictionResponse = await axios.get(`${API_BASE_URL}/divisions.geo`, {
      params: { lat, lng },
      headers: { 'X-API-Key': API_KEY }
    });

    const stateAbbr = jurisdictionResponse.data.divisions.find(d => d.type === 'state').id.split(':')[1];

    // Now, get the bills for this state
    const billsResponse = await axios.get(`${API_BASE_URL}/bills`, {
      params: {
        jurisdiction: stateAbbr,
        sort: '-updated_at',
        include: 'abstracts,sponsorships,actions,sources',
        per_page: 20
      },
      headers: { 'X-API-Key': API_KEY }
    });

    return billsResponse.data.results.map(bill => ({
      id: bill.id,
      title: bill.title,
      identifier: bill.identifier,
      jurisdiction: bill.jurisdiction.name,
      lastAction: bill.latest_action ? bill.latest_action.description : 'No actions',
      lastActionDate: bill.latest_action ? bill.latest_action.date : null,
      sponsors: bill.sponsorships.map(s => s.name),
      abstract: bill.abstracts.length > 0 ? bill.abstracts[0].abstract : 'No abstract available',
      sources: bill.sources.map(s => s.url)
    }));

  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};

module.exports = { getBillsByAddress };
