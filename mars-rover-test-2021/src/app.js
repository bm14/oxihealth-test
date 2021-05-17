import { useEffect, useState } from "react";
import "./app.css";
import socketIOClient from "socket.io-client";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [rovers, setRovers] = useState([]);
  const [newRoverName, setNewRoverName] = useState();

  useEffect(() => {
    const socket = socketIOClient.connect("http://localhost:4444", {
      path: "/ws"
    });

    socket.on("/rovers", data => {
      setRovers(data);
    });

    return () => socket.disconnect();
  }, []);

  const onNameChange = e => {
    setNewRoverName(e.target.value);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const addRover = async () => {
    const rawResponse = await fetch(
      `http://localhost:4444/add-rover/${newRoverName}`,
      {
        method: "POST"
      }
    );
    const content = await rawResponse.json();
  };

  return (
    <div>
      <div>
        {rovers.map(rover => (
          <div>
            {rover.name} - {rover.state}
          </div>
        ))}
      </div>
      <div>
        <button onClick={openModal}>New rover</button>
      </div>
      {/* I am the modal */}
      {showModal && (
        <div>
          <input type="text" onChange={onNameChange} />
          <button onClick={openModal}>Launch</button>
        </div>
      )}
    </div>
  );
}

export default App;
