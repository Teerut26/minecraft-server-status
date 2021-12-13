import { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./App.css";

var _ = require("lodash");

function App(props) {
  const [Data, setData] = useState(null);
  const [ShowAlert, setShowAlert] = useState(false);
  const [ShowAlertData, setShowAlertData] = useState("");
  const getData = async () => {
    let res = await fetch(
      "https://mcapi.us/server/status?ip=teerut.duckgdns.org"
    );
    let data = await res.json();
    setData(data);
  };

  useEffect(() => {
    getData();
    setInterval(() => {
      getData();
    }, 10000);
    
  }, []);

  if (!Data) {
    return <></>;
  }
  
  return (
    Data.online ? <div className="flex h-screen w-full justify-center items-center ">
    <div className="border-2 px-3 rounded-lg shadow-md">
      <div className="flex justify-center items-center gap-2">
        <img src={Data.favicon} />
      </div>
      <div className="flex justify-center items-center gap-2">
        <div className="text-2xl font-bold">{Data.motd}</div>
      </div>
      <div className="flex justify-center items-center gap-2 mb-2">
        <i class="fas fa-users"></i>
        <div className="text-1xl font-bold">
          {Data.players.now}/{Data.players.max}
        </div>
      </div>
      {ShowAlert && (
        <div className="alert alert-success" role="alert">
          <i class="fas fa-check"></i> {ShowAlertData}
        </div>
      )}

      <div className="flex flex-col justify-right items-center gap-2 mb-2 list overflow-auto">
        {Data.players.sample.map((item) => (
          <Card onCoppyId={(e) => {
            setShowAlert(true)
            setShowAlertData(e)
            setTimeout(() => {
              setShowAlert(false)
              setShowAlertData("")
            }, 1500);
          }} {...item} />
        ))}
      </div>
    </div>
  </div> : <OffLine />
  );
}

export default connect((state) => {
  return state;
})(App);

const OffLine = () => {
  return (
    <div className="flex h-screen w-full justify-center items-center ">
      <div className="font-bold text-5xl p-3 ">
        OFFLINE
      </div>
    </div>
  )
}

const Card = ({ name, id, onCoppyId }) => {
  const coppyId = (name) => {
    navigator.clipboard.writeText(name);
    onCoppyId(name);
  };

  return (
    <div className="border-2 flex w-full rounded-lg p-2 items-center gap-2">
      <div className="w-full flex rounded-lg items-center gap-2">
        <img
          src={`https://mc-heads.net/avatar/${name}`}
          width="32"
          height="32"
        />
        <div>{name}</div>
      </div>
      <div onClick={() => coppyId(name)}>
        <i class="fas fa-copy text-lg"></i>
      </div>
    </div>
  );
};
