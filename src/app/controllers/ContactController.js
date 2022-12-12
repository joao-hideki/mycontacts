const ContactsRepository = require('../repositories/ContactsRepository');
const isValidUUID = require('../utils/isValidUUID');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);
    // quando for retornar um objeto ou array JS -- para converter em JSON automaticamente
    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'invalid contact id' });
    }

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      // 404 - not found
      return response.status(404).json({ error: 'contact not found' });
    }

    response.json(contact);
  }

  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'invalid category id' });
    }

    if (email) {
      const contactExists = await ContactsRepository.findByEmail(email);
      if (contactExists) {
      // 400 - bad request
        return response.status(400).json({ error: 'this email is exists' });
      }
    }

    const contact = await ContactsRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    response.status(201).json(contact);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'invalid contact id' });
    }

    if (category_id && !isValidUUID(category_id)) {
      return response.status(400).json({ error: 'invalid category id' });
    }

    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }

    const contactExists = await ContactsRepository.findById(id);
    if (!contactExists) {
      return response.status(404).json({ error: 'contact not found' });
    }

    if (email) {
      const contactByEmail = await ContactsRepository.findByEmail(email);
      if (contactByEmail && contactByEmail.id !== id) {
        return response.status(400).json({ error: 'this email is in use' });
      }
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'invalid contact id' });
    }

    const contact = await ContactsRepository.findById(id);
    // if (!contact) {
    //   return response.status(400).json({ error: 'error' });
    // }

    await ContactsRepository.delete(id);
    // sendStatus() -- serve para mandar o status code sem body
    // 204 - No content -- a requisição deu certo, mas não tem nenhum body/corpo
    response.sendStatus(204);
  }
}

// Singleton
module.exports = new ContactController();
