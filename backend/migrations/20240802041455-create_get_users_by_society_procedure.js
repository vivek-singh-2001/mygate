'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Drop existing procedures/functions if they exist
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS GetUsersBySociety;
      DROP FUNCTION IF EXISTS GetUsersBySocietyAndWing;
      DROP FUNCTION IF EXISTS GetAdminsAndWingAdminsBySociety;
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
        isWingAdmin BOOLEAN,
        isMember BOOLEAN,
        house_no VARCHAR
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.number, u."isOwner", u."isAdmin", u."isWingAdmin", u."isMember",
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
      CREATE OR REPLACE FUNCTION GetUsersBySocietyAndWing(society_id INT, wing_id INT)
      RETURNS TABLE(
        id INT,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR,
        number VARCHAR,
        isOwner BOOLEAN,
        isAdmin BOOLEAN,
        isWingAdmin BOOLEAN,
        isMember BOOLEAN,
        house_no VARCHAR
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.number, u."isOwner", u."isAdmin", u."isWingAdmin", u."isMember",
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
          w.id = wing_id;
      END;
      $$;
    `);

    // Create procedure to fetch users who are both admin and wing admin by society ID
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION GetAdminsAndWingAdminsBySociety(society_id INT)
      RETURNS TABLE(
        id INT,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR,
        number VARCHAR,
        isOwner BOOLEAN,
        isAdmin BOOLEAN,
        isWingAdmin BOOLEAN,
        isMember BOOLEAN,
        houseId INT,
        house_no VARCHAR,
        wingId INT,
        wing_name VARCHAR,
        houseuserId INT
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.number, u."isOwner", u."isAdmin", u."isWingAdmin", u."isMember",
          h.id,h.house_no,w.id,w.name,hu.id
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
          u."isAdmin" = true OR
          u."isWingAdmin" = true;
      END;
      $$;
    `);
  },

  async down (queryInterface, Sequelize) {
    // Drop functions if they exist
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS GetUsersBySociety;
      DROP FUNCTION IF EXISTS GetUsersBySocietyAndWing;
      DROP FUNCTION IF EXISTS GetAdminsAndWingAdminsBySociety;
    `);
  }
};
