const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.POSTGRESS_URL,
});

const getReservation = (request, response) => {
  pool.query("SELECT * FROM reservations ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getReservationById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM reservations WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createReservation = (request, response) => {
  const { event_category, date, start_time, end_time, rooms_id , users_id, access_key, status} = request.body;

  pool.query(
    "INSERT INTO reservations (event_category, date, start_time, end_time, rooms_id , users_id, access_key, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [event_category, date, start_time, end_time, rooms_id , users_id, access_key, status],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Reservation added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateReservation = (request, response) => {
  const id = parseInt(request.params.id);
  const { event_category, date, start_time, end_time, rooms_id , users_id, access_key, status } = request.body;

  pool.query(
    "UPDATE reservations SET event_category = $1, date = $2, start_time = $3 , end_time = $4, rooms_id = $5, users_id = $6, access_key = $7, status = $8 WHERE id = $9",
    [event_category, date, start_time, end_time, rooms_id , users_id, access_key, status, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Reservation modified with ID: ${id}`);
    }
  );
};

const deleteReservation = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM reservations WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Reservation deleted with ID: ${id}`);
  });
};

module.exports = {
  getReservation,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
