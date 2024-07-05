const { spawn } = require('child_process');
const path = require('path');
const db = require('../db');

const states = [
    'ak', 'al', 'ar', 'az', 'ca', 'co', 'ct', 'dc', 'de', 'fl', 'ga',
    'hi', 'ia', 'id', 'il', 'in', 'ks', 'ky', 'la', 'ma', 'md', 'me',
    'mi', 'mn', 'mo', 'ms', 'mt', 'nc', 'nd', 'ne', 'nh', 'nj', 'nm',
    'nv', 'ny', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx',
    'ut', 'va', 'vt', 'wa', 'wi', 'wv', 'wy'
];

const runScrapers = async () => {
    const scraperPath = path.join(__dirname, '../../../openstates-scrapers');
    
    for (const state of states) {
        console.log(`Starting scraper for ${state.toUpperCase()}`);
        
        const scraper = spawn('poetry', ['run', 'os-update', state], { cwd: scraperPath });

        scraper.stdout.on('data', (data) => {
            console.log(`Scraper output (${state}): ${data}`);
        });

        scraper.stderr.on('data', (data) => {
            console.error(`Scraper error (${state}): ${data}`);
        });

        await new Promise((resolve) => {
            scraper.on('close', async (code) => {
                console.log(`Scraper process for ${state} exited with code ${code}`);
                if (code === 0) {
                    await importScrapedData(state);
                }
                resolve();
            });
        });
    }
};

const importScrapedData = async (state) => {
    const scraperPath = path.join(__dirname, '../../../openstates-scrapers');
    const dataPath = path.join(scraperPath, `_data/${state}/bills.json`);
    
    const bills = require(dataPath);

    for (const bill of bills) {
        const { rows } = await db.query(
            'INSERT INTO bills (state, session, identifier, title, latest_action_date, latest_action_description, abstract, sources) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            [state.toUpperCase(), bill.session, bill.identifier, bill.title, bill.latest_action_date, bill.latest_action_description, bill.abstract, JSON.stringify(bill.sources)]
        );

        const insertedBillId = rows[0].id;

        for (const sponsor of bill.sponsorships) {
            await db.query(
                'INSERT INTO sponsorships (bill_id, name, classification) VALUES ($1, $2, $3)',
                [insertedBillId, sponsor.name, sponsor.classification]
            );
        }
    }

    console.log(`Data import completed for ${state.toUpperCase()}`);
};

runScrapers().catch(console.error);

module.exports = { runScrapers };
