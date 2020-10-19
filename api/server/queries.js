/* eslint-disable quotes */
// SQL QUERIES FOR ROUTES
export const query = {
  // USERS TABLE QUERIES
  getUserDataForVerification: (mail) => ({
    text: 'SELECT id, name, password FROM users where email = $1',
    values: [mail]
  }),
  createUser: (newUser, hash) => ({
    text: 'INSERT INTO users(name, email, password, phone) VALUES($1, $2, $3, $4)',
    values: [newUser.name, newUser.email, hash, newUser.phone]
  }),
  findUser: (mail) => ({ text: 'SELECT id, name FROM users WHERE email = $1', values: [mail] }),
  findUserById: (userId) => ({ text: 'SELECT id, name, email, phone FROM users WHERE id = $1', values: [userId] }),
  updateUserDetails: (name, phone, userId) => ({
    text: 'UPDATE users SET name = $1, phone = $2 WHERE id = $3',
    values: [name, phone, userId]
  }),

  // CONTACTS TABLE QUERIES
  getContactDataForVerification: (email, userId) => ({
    text: 'SELECT * FROM contacts WHERE email = $1 AND userId = $2',
    values: [email, userId]
  }),
  createContact: (newContact, userId) => ({
    text: 'INSERT INTO contacts(name, userId, email, phone) VALUES($1, $2, $3, $4)',
    values: [newContact.name, userId, newContact.email, newContact.phone]
  }),
  findContacts: (userId) => ({
    text: 'SELECT * FROM contacts WHERE userId = $1',
    values: [userId]
  }),
  findContactById: (userId, id) => ({
    text: 'SELECT * FROM contacts WHERE userId = $1 AND id = $2',
    values: [userId, id]
  }),
  updateContactDetails: (name, phone, userId, id) => ({
    text: 'UPDATE contacts SET name = $1, phone = $2 WHERE userId = $3 AND id = $4',
    values: [name, phone, userId, id]
  }),
  deleteContact: (email, userId, id) => ({
    text: 'DELETE FROM contacts WHERE email = $1 AND userId = $2 AND id = $3',
    values: [email, userId, id]
  })
};
