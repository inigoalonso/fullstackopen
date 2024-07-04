import { useState, useEffect } from 'react'
import personService from './services/persons'

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
  <p>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></p>
);

const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person => <Person key={person.name} person={person} deletePerson={deletePerson} />)}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '+358 01010101' },
    { name: 'Charles Babbage', number: '+358 20202020' },
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        });
    }
    setNewName('');
    setNewNumber('');
  };

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`delete ${person.name} ?`)) {
      personService.remove(id).then(() => {
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
  )
}

export default App