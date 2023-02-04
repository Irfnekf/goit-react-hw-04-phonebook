import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import css from './phonebook.module.css';

import ContactsForm from '../ContactsForm/ContactsForm';
import ContactsList from '../ContactsList/ContactsList';
import ContactsFilter from '../ContactsFilter/ContactsFilter';

const Phonebook = () => {
  const [contacts, setContacts] = useState(() => {
    const contact = JSON.parse(localStorage.getItem('my-contacts'));
    return contact ? contact : [];
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('my-contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = ({ name, number }) => {
    if (isDublicate(name)) {
      alert(`${name} is already in contacts.`);
      return false;
    }
    setContacts(prevContacts => {
      const newContact = {
        id: nanoid(),
        name,
        number,
      };
      return [newContact, ...prevContacts];
    });
    return true;
  };

  const removeContact = id => {
    setContacts(prevContacts => prevContacts.filter(item => item.id !== id));
  };

  const isDublicate = name => {
    const normalizedName = name.toLowerCase();
    const contactDubl = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedName;
    });

    return Boolean(contactDubl);
  };

  const handleFilter = ({ target }) => setFilter(target.value);

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }
    const normalizedFilter = filter.toLowerCase();
    const result = contacts.filter(({ name, number }) => {
      return (
        name.toLowerCase().includes(normalizedFilter) ||
        number.toLowerCase().includes(normalizedFilter)
      );
    });

    return result;
  };
  const contactsFilter = getFilteredContacts();
  const isContact = Boolean(contactsFilter.length);

  return (
    <>
      <div className={css.con}>
        <div className={css.container}>
          <header className={css.header}>
            <h1 className={css.title}>Phonebook</h1>
            <ContactsForm onSubmit={addContact} />
          </header>
          <div className={css.contact_library}>
            <h2 className={css.title}>Contacts</h2>

            <ContactsFilter handleChange={handleFilter} filter={filter} />
            {isContact && (
              <ContactsList
                removeContact={removeContact}
                contacts={contactsFilter}
              />
            )}
            {!isContact && <p>No contacts in list</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Phonebook;
