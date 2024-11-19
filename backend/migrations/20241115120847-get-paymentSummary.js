'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION GetPaymentSummary(
        societyId UUID,
        fromDate TIMESTAMP,
        toDate TIMESTAMP
      )
      RETURNS TABLE (
        total_income NUMERIC,
        pending_income NUMERIC,
        total_expense NUMERIC,
        current_balance NUMERIC
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          -- Total successful payments in the specified date range
          COALESCE(SUM(CASE WHEN p.status = 'success' THEN p.amount ELSE 0 END), 0) AS total_income,
          -- Pending payments in the specified date range
          COALESCE(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) AS pending_income,
          -- Total expenses in the specified date range
          COALESCE(SUM(CASE WHEN e.status = 'approved' THEN e.amount ELSE 0 END), 0) AS total_expense,
          -- Current balance (all successful payments - all approved expenses)
          COALESCE((
            SELECT SUM(CASE WHEN p_all.status = 'success' THEN p_all.amount ELSE 0 END)
            FROM Payments p_all
            JOIN Houses h_all ON p_all.houseId = h_all.id
            JOIN Floors f_all ON h_all.floorId = f_all.id
            JOIN Wings w_all ON f_all.wingId = w_all.id
            WHERE w_all.societyId = societyId
          ), 0)
          - COALESCE((
            SELECT SUM(e_all.amount)
            FROM SocietyExpenses e_all
            WHERE e_all.societyId = societyId AND e_all.status = 'approved'
          ), 0) AS current_balance
        FROM Payments p
        JOIN Houses h ON p.houseId = h.id
        JOIN Floors f ON h.floorId = f.id
        JOIN Wings w ON f.wingId = w.id
        LEFT JOIN SocietyExpenses e ON e.societyId = w.societyId AND e.date BETWEEN fromDate AND toDate
        WHERE w.societyId = societyId
          AND (fromDate IS NULL OR p.paymentDate >= fromDate)
          AND (toDate IS NULL OR p.paymentDate <= toDate);
      END;
      $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS GetPaymentSummary(UUID, TIMESTAMP, TIMESTAMP);
    `);
  },
};
