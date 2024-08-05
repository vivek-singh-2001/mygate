'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Drop existing procedures/functions if they exist
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS GetUsersBySociety;
      DROP FUNCTION IF EXISTS GetUsersBySocietyAndWing;
    `);

    // Create procedure to fetch users by society ID
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION GetUsersBySociety(society_id INT)
      RETURNS TABLE(
        id INT,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR,
        number VARCHAR,
        isOwner BOOLEAN,
        isAdmin BOOLEAN,
        isWINGADMIN BOOLEAN,
        isMEMBER BOOLEAN,
        house_no VARCHAR
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.number, u."isOwner", u."isAdmin", u."isWINGADMIN", u."isMEMBER",
          h.house_no
        FROM 
          "Users" u
        JOIN 
          "HouseUsers" hu ON u.id = hu."UserId"
        JOIN 
          "Houses" h ON hu."HouseId" = h.id
        JOIN 
          "Wings" w ON h."WingId" = w.id
        WHERE 
          w."SocietyId" = society_id;
      END;
      $$;
    `);

    // Create procedure to fetch users by society ID and wing name
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION GetUsersBySocietyAndWing(society_id INT, wing_name VARCHAR)
      RETURNS TABLE(
        id INT,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR,
        number VARCHAR,
        isOwner BOOLEAN,
        isAdmin BOOLEAN,
        isWINGADMIN BOOLEAN,
        isMEMBER BOOLEAN,
        house_no VARCHAR
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.number, u."isOwner", u."isAdmin", u."isWINGADMIN", u."isMEMBER",
          h.house_no
        FROM 
          "Users" u
        JOIN 
          "HouseUsers" hu ON u.id = hu."UserId"
        JOIN 
          "Houses" h ON hu."HouseId" = h.id
        JOIN 
          "Wings" w ON h."WingId" = w.id
        WHERE 
          w."SocietyId" = society_id AND
          w.name = wing_name;
      END;
      $$;
    `);
  },

  async down (queryInterface, Sequelize) {
    // Drop functions if they exist
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS GetUsersBySociety;
      DROP FUNCTION IF EXISTS GetUsersBySocietyAndWing;
    `);
  }
};
