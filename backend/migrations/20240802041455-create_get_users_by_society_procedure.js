"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing procedures/functions if they exist
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS GetUsersBySociety;
      DROP FUNCTION IF EXISTS GetUsersBySocietyAndWing;
    `);

    // Create procedure to fetch users by society ID
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION GetUsersBySociety(society_id INT, limits INT DEFAULT 10, offsets INT DEFAULT 0, searchQuery VARCHAR DEFAULT NULL)
      RETURNS TABLE(
        id UUID,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR,
        photo VARCHAR,
        number VARCHAR,
        house_no INT,
        total_count INT
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.photo, u.number, h.house_no,
          (SELECT COUNT(*)::int FROM "users" u
            JOIN "houseUsers" hu ON u.id = hu."userId"
            JOIN "houses" h ON hu."houseId" = h.id
            JOIN "floors" f ON h."floorId" = f.id
            JOIN "wings" w ON f."wingId" = w.id
            WHERE w."societyId" = society_id 
            AND (
              searchQuery IS NULL OR searchQuery = '' OR
              u.firstname ILIKE '%' || searchQuery || '%' OR
              u.lastname ILIKE '%' || searchQuery || '%' OR
              u.email ILIKE '%' || searchQuery || '%' OR
              u.number LIKE '%' || searchQuery || '%'
            )
          ) AS total_count  
        FROM 
          "users" u
        JOIN 
          "houseUsers" hu ON u.id = hu."userId"
        JOIN 
          "houses" h ON hu."houseId" = h.id
        JOIN 
          "floors" f ON h."floorId" = f.id
        JOIN 
          "wings" w ON f."wingId" = w.id
        WHERE 
          w."societyId" = society_id
          AND (
            searchQuery IS NULL OR searchQuery = '' OR
            u.firstname ILIKE '%' || searchQuery || '%' OR
            u.lastname ILIKE '%' || searchQuery || '%' OR
            u.email ILIKE '%' || searchQuery || '%' OR
            u.number LIKE '%' || searchQuery || '%'
          )
        LIMIT limits OFFSET offsets;
      END;
      $$;
    `);

    // Create procedure to fetch users by society ID and wing name
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION GetUsersBySocietyAndWing(society_id UUID, wing_id UUID)
      RETURNS TABLE(
        id UUID,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR,
        number VARCHAR,
        house_no INT
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.number,
          h.house_no
        FROM 
          "users" u
        JOIN 
          "houseUsers" hu ON u.id = hu."userId"
        JOIN 
          "houses" h ON hu."houseId" = h.id
        JOIN 
          "floors" f ON h."floorId" = f.id
        JOIN 
          "wings" w ON f."wingId" = w.id
        WHERE 
          w."societyId" = society_id AND
          w.id = wing_id;
      END;
      $$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop functions if they exist
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS GetUsersBySociety;
      DROP FUNCTION IF EXISTS GetUsersBySocietyAndWing;
    `);
  },
};
