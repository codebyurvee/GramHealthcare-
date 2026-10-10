const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('./pool');

async function importCSV(filePath, tableName, columns) {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    for (const row of results) {
                        const placeholders = columns.map(() => '?').join(', ');
                        const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
                        await pool.query(sql, Object.values(row));
                    }
                    console.log(`✅ Imported ${results.length} rows into ${tableName}`);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', reject);
    });
}

async function runImport() {
    console.log('📥 Starting CSV import...');
    try {
        await importCSV(
            path.join(__dirname, 'facilities.csv'),
            'facilities',
            ['name', 'type', 'district', 'address', 'latitude', 'longitude', 'contact_number']
        );
        await importCSV(
            path.join(__dirname, 'patients.csv'),
            'patients',
            ['name', 'age', 'gender', 'phone', 'preferred_language']
        );
        console.log('🎉 All CSV data imported successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

runImport();
