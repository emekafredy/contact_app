import client from '../db/config';
import { query } from '../queries';
import { contactValidators, validatorResponse } from '../middleware/validation';
import { authorizeUser } from '../middleware/auth';
import { errorResponse, trimData } from '../utils';

const contactRoutes = (app, prefix) => {
  /**
   * POST /contacts
   * Purpose: add new contact
   */
  app.post(`${prefix}/contacts`,
    authorizeUser,
    contactValidators,
    validatorResponse,
    async (req, res) => {
      try {
        const userId = req.user;
        const { name, email, phone } = req.body;

        const newContact = { name, email, phone };

        const existingContact = await client.query(query.getContactDataForVerification(email, userId));
        if (existingContact.rowCount > 0) return errorResponse([{ msg: 'Contact already exists' }], 409, res);
        
        trimData(newContact);
        await client.query(query.createContact(newContact, userId));
        const contact = await client.query(query.getContactDataForVerification(email, userId));

        return res.status(201).json({ success: true, contact: contact.rows[0] });
      } catch (error) {
        res.json(error);
      }
    });
  
  /**
   * GET /contacts
   * Purpose: get user's contacts
   */
  app.get(`${prefix}/contacts`,
    authorizeUser,
    async (req, res) => {
      try {
        const userId = req.user;
        const contacts = await client.query(query.findContacts(userId));

        return res.status(201).json({ success: true, contacts: contacts.rows });
      } catch (error) {
        res.json(error);
      }
    });

  /**
   * GET /contact/:id
   * Purpose: get a single contact
   */
  app.get(`${prefix}/contact/:id`,
    authorizeUser,
    async (req, res) => {
      try {
        const userId = req.user;
        const { id } = req.params;

        const contact = await client.query(query.findContactById(userId, id));
        if (contact.rowCount === 0) return errorResponse([{ msg: 'Contact does not exist' }], 404, res);

        return res.status(201).json({ success: true, contact: contact.rows[0] });
      } catch (error) {
        res.json(error);
      }
    });

  /**
   * PUT /contact/:id
   * Purpose: update logged-in user's contact
   */
  app.put(`${prefix}/contact/:id`,
    authorizeUser,
    async (req, res) => {
      try {
        const userId = req.user;
        const { name, phone } = req.body;
        const { id } = req.params;

        const contact = await client.query(query.findContactById(userId, id));
        if (contact.rowCount === 0) return errorResponse([{ msg: 'Contact does not exist' }], 404, res);

        const contactUpdateDetails = {
          name: name || (contact.rows[0].name || ''),
          phone: phone || (contact.rows[0].phone || '')
        };
      
        await trimData(contactUpdateDetails);
        await client.query(query.updateContactDetails(
          contactUpdateDetails.name, contactUpdateDetails.phone, userId, id
        ));
        const update = await client.query(query.findContactById(userId, id));

        return res.status(200).json({ success: true, contact: update.rows[0] });
      } catch (error) {
        res.json(error);
      }
    });

  /**
   * DELETE /contact/:id
   * Purpose: delete logged-in user's contact
   */
  app.delete(`${prefix}/contact/:id`,
    authorizeUser,
    async (req, res) => {
      const userId = req.user;
      const { id } = req.params;

      const contact = await client.query(query.findContactById(userId, id));
      if (contact.rowCount === 0) return errorResponse([{ msg: 'Contact does not exist' }], 404, res);

      await client.query(query.deleteContact(contact.rows[0].email, userId, id));
      return res.status(200).json({ success: true, message: 'Contact deleted' });
    });
};

export default contactRoutes;
