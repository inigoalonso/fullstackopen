import { useState, useEffect } from 'react';
import personService from './services/persons';
import './index.css';

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    filter shown with <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Person = ({ person, deletePerson }) => (
  <p>
    {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
  </p>
);

const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person => (
      <Person key={person.id} person={person} deletePerson={deletePerson} />
    ))}
  </div>
);

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const addPerson = event => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    const newPerson = { name: newName, number: newNumber };

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(existingPerson.id, newPerson).then(returnedPerson => {
          setPersons(persons.map(person => (person.id !== existingPerson.id ? person : returnedPerson)));
          setNotification({ message: `Updated ${newName}'s number`, type: 'success' });
          setTimeout(() => {
            setNotification({ message: null, type: '' });
          }, 5000);
          setNewName('');
          setNewNumber('');
        }).catch(error => {
          // this is the way to access the error message
          console.log(error.response.data.error)
          setNotification({ message: error.response.data.error, type: 'error' });
          setTimeout(() => {
            setNotification({ message: null, type: '' });
          }, 5000);
        });
      }
    } else {
      personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNotification({ message: `Added ${newName}`, type: 'success' });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        // this is the way to access the error message
        console.log(error.response.data.error)
        setNotification({ message: error.response.data.error, type: 'error' });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
      })
    }
  };

  const deletePerson = id => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id));
        setNotification({ message: `Deleted ${person.name}`, type: 'success' });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
      }).catch(error => {
        setNotification({
          message: `Information of ${person.name} has already been removed from the server`,
          type: 'error'
        });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
        setPersons(persons.filter(p => p.id !== id));
      });
    }
  };

  const personsFiltered = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>add a new</h3>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={personsFiltered} deletePerson={deletePerson} />

    </div>
  );
};

export default App;
