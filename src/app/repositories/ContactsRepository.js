// gerador de hash/id
const { v4 } = require('uuid');

const db = require('../../database/index');

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
  async findAll(orderBy = 'ASC') {
    const order = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`SELECT * FROM contacts ORDER BY name ${order}`);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query('SELECT * FROM contacts WHERE id = $1', [id]);
    return row;
  }

  delete(id) {
    return new Promise((resolve) => {
      contacts = contacts.filter((contact) => contact.id !== id);
      // quando não deseja capturar o retorno em uma variável executa o resolve vazio
      resolve();
    });
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM contacts WHERE email = $1', [email]);
    return row;
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
