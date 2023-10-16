import { useState, useEffect } from "react";

function App() {
  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState("");

  const fetchData = async (url, options = {}) => {
    const response = await fetch(url, options);
    return await response.json();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await fetchData("http://localhost:5000/api/contacts");
      setContacts(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const createContact = async (name) => {
    try {
      await fetchData("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      fetchContacts();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await fetchData(`http://localhost:5000/api/contacts/${contactId}`, {
        method: "DELETE",
      });
      fetchContacts();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="Container">
      <h1>Contactor</h1>
      <div className="mainContainer">
        <h2>Contact</h2>
        <div className="addName">
          <input
            type="text"
            placeholder="New Contact Name"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
          />
          <button
            onClick={() => {
              if (newContactName.trim() === "") {
                alert("Contact name cannot be blank");
                return;
              }
              createContact(newContactName);
              setNewContactName("");
            }}
          >
            Add Contact
          </button>
        </div>
        {contacts.length > 0 && <hr />}

        <div className="contactList">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              deleteContact={deleteContact}
              fetchData={fetchData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactCard({ contact, deleteContact, fetchData }) {
  const [phones, setPhones] = useState([]);
  const [newPhoneName, setNewPhoneName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [showPhones, setShowPhones] = useState(false);

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      const data = await fetchData(
        `http://localhost:5000/api/contacts/${contact.id}/phones`
      );
      setPhones(data);
    } catch (error) {
      console.log("Error fetching phones:", error);
    }
  };
  const deletePhone = async (phoneId) => {
    try {
      await fetchData(
        `http://localhost:5000/api/contacts/${contact.id}/phones/${phoneId}`,
        {
          method: "DELETE",
        }
      );
      fetchPhones();
    } catch (error) {
      console.log("Error deleting phone:", error);
    }
  };

  const addPhone = async () => {
    if (newPhoneName.trim() === "" || newPhoneNumber.trim() === "") {
      alert("Phone name and number cannot be blank");
      return;
    }
    try {
      await fetchData(
        `http://localhost:5000/api/contacts/${contact.id}/phones`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newPhoneName,
            number: newPhoneNumber,
            contactId: contact.id,
          }),
        }
      );
      fetchPhones();
      setNewPhoneName("");
      setNewPhoneNumber("");
    } catch (error) {
      console.log("Error adding phone:", error);
    }
  };

  return (
    <div className="Card">
      <div className="Info">
        <div className="name" onClick={() => setShowPhones(!showPhones)}>
          {contact.name}
        </div>
        <div className="function">
          <button className="delete" onClick={() => deleteContact(contact.id)}>
            Delete
          </button>
          <button className="view" onClick={() => setShowPhones(!showPhones)}>
            {showPhones ? "Hide" : "View Phones"}
          </button>
        </div>
      </div>
      {phones.length > 0 && showPhones == true && <hr />}

      {showPhones && (
        <div className="Phones">
          <table>
            <thead>
              <tr>
                <th>Phone Name</th>
                <th>Phone Number</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {phones.map((phone) => (
                <tr key={phone.id}>
                  <td>{phone.name}</td>
                  <td>{phone.number}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => deletePhone(phone.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Phone Name"
                    value={newPhoneName}
                    onChange={(e) => setNewPhoneName(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                  />
                </td>
                <td>
                  <button className="addPhone" onClick={addPhone}>
                    Add Phone
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
