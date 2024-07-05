const db = require('../db');

const getBillsByAddress = async (address) => {
  // In a real app, you'd use the address to determine the state
  // For now, we'll just return all bills
  const { rows } = await db.query('SELECT * FROM bills ORDER BY latest_action_date DESC LIMIT 20');

  const billsWithSponsors = await Promise.all(rows.map(async (bill) => {
    const { rows: sponsors } = await db.query('SELECT name, classification FROM sponsorships WHERE bill_id = $1', [bill.id]);
    return { ...bill, sponsors };
  }));

  return billsWithSponsors;
};

module.exports = { getBillsByAddress };
