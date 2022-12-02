import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);

  const baseUrl = 'http://localhost:4000';

  // fetch all guests
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/guests/`);
      const guests = await response.json();
      setGuestList(guests);
      setIsLoading(false);
    }
    fetchData().catch(() => {});
  }, []);

  // create new guest
  const createGuest = async () => {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    setGuestList([...guestList, createdGuest]);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    createGuest((firstName, lastName, isAttending)).catch(() => {});
    setFirstName('');
    setLastName('');
    setIsAttending(false);
  };

  // attending status
  const changeStatusAttending = async (id, status) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ attending: status }),
    });
    const updatedGuest = await response.json();

    const updatedGuestList = [...guestList];
    const selectedGuest = updatedGuestList.find((guest) => guest.id === id);
    selectedGuest.attending = status;
    setGuestList(updatedGuestList);
    return updatedGuest;
  };

  // delete one guest
  const deleteGuest = async (id) => {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = guestList.filter(
      (guest) => guest.id !== deletedGuest.id,
    );
    setGuestList(newGuestList);
  };

  // delete all guests
  const deleteAllGuests = async () => {
    for (let i = 0; i < guestList.length; i++) {
      const currentGuestId = guestList[i].id;
      const response = await fetch(`${baseUrl}/guests/${currentGuestId}`, {
        method: 'DELETE',
      });

      setGuestList([]);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1>GUEST LIST</h1>
        <div className="formStyle">
          <form onSubmit={submitHandler}>
            <label>
              <input
                placeholder="First Name"
                value={firstName}
                required
                onChange={(event) => setFirstName(event.target.value)}
                // disabled={isLoading ? 'disabled' : ''}
              />
            </label>
            <label>
              <input
                placeholder="Last Name"
                value={lastName}
                required
                onChange={(event) => setLastName(event.target.value)}
                // disabled={isLoading ? 'disabled' : ''}
              />
            </label>
            <button className="addBtn">ADD Guest</button>
            <button className="removeBtn" onClick={() => deleteAllGuests()}>
              REMOVE all
            </button>
          </form>
        </div>
        <div>
          {isLoading ? (
            'Loading...'
          ) : (
            <ul>
              {guestList.map((guest) => {
                return (
                  <div key={guest.id} className="entryContainer">
                    <li>
                      <div className="detailStyle">
                        <div className="nameStyle">
                          {guest.firstName} {guest.lastName}
                        </div>
                        <input
                          type="checkbox"
                          checked={guest.attending}
                          onChange={(event) => {
                            changeStatusAttending(
                              guest.id,
                              event.currentTarget.checked,
                            ).catch(() => {});
                          }}
                        />
                        is attending: {guest.attending ? '👍' : '👎'}
                      </div>
                      <button
                        className="removeOneBtn"
                        onClick={() => deleteGuest(guest.id)}
                      >
                        Remove
                      </button>
                    </li>
                  </div>
                );
              })}
            </ul>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
}
export default App;
