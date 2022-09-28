import { useEffect, useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = 'http://localhost:4000';

  async function createGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: { firstName },
        lastName: { lastName },
      }),
    });
    const createdGuest = await response.json();
    setGuests(createdGuest);
  }
  async function getGuest() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    console.log(allGuests);
  }
  useEffect(() => {
    getGuest().catch(() => {});
  }, []);

  useEffect(() => {
    if (guests) {
      setIsLoading(false);
    }
  }, [guests]);
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1>Guest List</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
          />
        </label>
        <label>
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
          />
        </label>
        <button
          onClick={async () => {
            setFirstName('');
            setLastName('');
            await createGuest();
            await getGuest();
          }}
        >
          Add
        </button>
        <div>
          {guests.map((guest) => {
            return (
              <div key={`guests-${guest.id}`}>
                {guest.firstName} {guest.lastName}
                {guest.attending}
              </div>
            );
          })}
        </div>
      </form>
    </>
  );
}
export default App;
