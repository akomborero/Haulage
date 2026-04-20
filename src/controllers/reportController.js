const db = require('../db');

exports.getDailySummary = async (req, res) => {
  try {
    const summaryQuery = `
      SELECT 
        (SELECT COUNT(*) FROM trucks) as total_trucks,
        (SELECT COUNT(*) FROM trucks WHERE status = 'AVAILABLE') as available_trucks,
        (SELECT COUNT(*) FROM users WHERE status = 'AVAILABLE') as available_drivers,
        (SELECT COUNT(*) FROM jobs WHERE status = 'IN_PROGRESS') as active_jobs,
        (SELECT COALESCE(SUM(cargo_weight_kg), 0) FROM jobs WHERE status = 'IN_PROGRESS') as total_weight
    `;

    const result = await db.query(summaryQuery);
    const data = result.rows[0];

    // Business Logic: Fleet Availability Percentage
    const total = parseInt(data.total_trucks);
    const avail = parseInt(data.available_trucks);
    const healthScore = total > 0 ? (avail / total) * 100 : 0;

    res.status(200).json({
      report_date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
      fleet_stats: {
        total_vehicles: total,
        on_the_road: parseInt(data.active_jobs),
        maintenance_or_idle: total - avail - parseInt(data.active_jobs)
      },
      capacity_utilization: {
        moving_tonnage_kg: parseInt(data.total_weight),
        drivers_on_standby: parseInt(data.available_drivers)
      },
      operational_health: `${healthScore.toFixed(1)}%`
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to generate report: " + err.message });
  }
};