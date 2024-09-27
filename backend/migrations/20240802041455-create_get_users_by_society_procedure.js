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
  id INT,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR,
  photo VARCHAR,
  number VARCHAR,
  isOwner BOOLEAN,
  isMember BOOLEAN,
  house_no VARCHAR,
  total_count INT  -- Add total_count to the return structure
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id, u.firstname, u.lastname, u.email,u.photo, u.number, u."isOwner", u."isMember", h.house_no,
    (SELECT COUNT(*)::int FROM "Users" u
      JOIN "houseUsers" hu ON u.id = hu."UserId"
      JOIN "houses" h ON hu."HouseId" = h.id
      JOIN "wings" w ON h."WingId" = w.id
      WHERE w."SocietyId" = society_id 
       AND (
        searchQuery IS NULL OR searchQuery = '' OR
        u.firstname ILIKE '%' || searchQuery || '%' OR
        u.lastname ILIKE '%' || searchQuery || '%' OR
        u.email ILIKE '%' || searchQuery || '%' OR
        u.number LIKE '%' || searchQuery || '%'
      )
      ) AS total_count  
  FROM 
    "Users" u
  JOIN 
    "houseUsers" hu ON u.id = hu."UserId"
  JOIN 
    "houses" h ON hu."HouseId" = h.id
  JOIN 
    "wings" w ON h."WingId" = w.id
  WHERE 
    w."SocietyId" = society_id
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
      CREATE OR REPLACE FUNCTION GetUsersBySocietyAndWing(society_id INT, wing_id INT)
      RETURNS TABLE(
        id INT,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR,
        number VARCHAR,
        isOwner BOOLEAN,
        isMember BOOLEAN,
        house_no VARCHAR
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          u.id, u.firstname, u.lastname, u.email, u.number, u."isOwner", u."isMember",
          h.house_no
        FROM 
          "Users" u
        JOIN 
          "houseUsers" hu ON u.id = hu."UserId"
        JOIN 
          "houses" h ON hu."HouseId" = h.id
        JOIN 
          "wings" w ON h."WingId" = w.id
        WHERE 
          w."SocietyId" = society_id AND
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
