// gerador de hash/id
const { v4 } = require('uuid');

const db = require('../../database');

let contacts = [
  {
    id: v4(),
    name: 'João',
    email: 'joao@email.com',
    phone: '111111111',
    category_id: v4(),
  },
  {
    id: v4(),
    name: 'José',
    email: 'joao@email.com',
    phone: '111111111',
    category_id: v4(),
  },
  {
    id: v4(),
    name: 'Amanda',
    email: 'joao@email.com',
    phone: '111111111',
    category_id: v4(),
  },
];

class ContactsRepository {
  findAll() {
    // resolve - dispara um sucesso; reject - dispara um erro
    return new Promise((resolve) => {
      resolve(contacts);
    });
  }

  findById(id) {
    return new Promise((resolve) => {
      /* utiliza o resolve como se fosse o return, para conseguir capturar o retorno em uma variável
      onde for executado
      */
      resolve(contacts.find(((contact) => contact.id === id)));
    });
  }

  delete(id) {
    return new Promise((resolve) => {
      contacts = contacts.filter((contact) => contact.id !== id);
      // quando não deseja capturar o retorno em uma variável executa o resolve vazio
      resolve();
    });
  }

  findByEmail(email) {
    return new Promise((resolve) => {
      resolve(contacts.find((contact) => contact.email === email));
    });
  }

  async create({
    name, email, phone, category_id,
  }) {

    const [row] = await db.query(`
        INSERT INTO contacts(name, email, phone, category_id)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `, [name, email, phone, category_id]);

    return row;
  }

  update(id, {
    name, email, phone, category_id,
  }) {
    return new Promise((resolve) => {
      const updatedContact = {
        id,
        name,
        email,
        phone,
        category_id,
      };

      contacts = contacts.map((contact) => (
        contact.id === id ? updatedContact : contact
      ));

      resolve(updatedContact);

    });
  }

}

module.exports = new ContactsRepository();
