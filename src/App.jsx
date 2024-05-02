import "./App.css";
import horoscopeData from "./data/Data";
import { useState } from "react";

const SignButton = ({ name, showSign }) => {
  return (
    <>
      <button className="sign-button" onClick={showSign}>
        {name}
      </button>
    </>
  );
};

const Divider = ({ signsData }) => {
  return (
    <div className="divider">
      {signsData.map((sign) => (
        <img key={sign.key} src={sign.img} />
      ))}
    </div>
  );
};

const SignInfo = ({ selectedSign, closeSignInfo }) => {
  return (
    <>
      <h2>{selectedSign.signName}</h2>
      <img src={selectedSign.img} />
      <div className="sign-info">
        <p>
          {selectedSign.startDate} — {selectedSign.endDate}
        </p>
        <p>Lucky numbers: {selectedSign.luckyNumbers.toString()}</p>
        <p>Key traits: {selectedSign.traits}</p>
        <p>Today's Horoscope: {selectedSign.dailyHoroscope}</p>
      </div>
      <button onClick={closeSignInfo}>Choose another sign</button>
    </>
  );
};

function App() {
  const [showStart, setShowStart] = useState(true);
  const [selectedSign, setSelectedSign] = useState(null);

  // get the astrology sign data object
  const signsData = horoscopeData.horoscopes.astroSigns;

  // get the zodiac sign data based on a given date
  function findSign(date) {
    const zodiacSign = signsData.find((sign) => {
      const startDate = new Date(
        sign.startDate + " " + currentDate.getFullYear()
      );
      const endDate = new Date(sign.endDate + " " + currentDate.getFullYear());
      return date >= startDate && date <= endDate;
    });
    return zodiacSign;
  }

  // get today's date and format it nicely
  const currentDate = new Date();
  const currentSign = findSign(currentDate);
  const currentSignName = currentSign.signName;

  const nextSignStartDate = new Date(
    currentSign.endDate + " " + currentDate.getFullYear()
  );
  nextSignStartDate.setDate(nextSignStartDate.getDate() + 1);
  const nextSignName = findSign(nextSignStartDate).signName;

  return (
    <>
      <h1>Horoscopes</h1>
      {showStart ? (
        <>
          <section className="welcome">
            <p>Welcome.</p>
            <p>
              Click enter to learn more about the twelve zodiac signs and their
              daily horoscopes.
            </p>
            <button onClick={() => setShowStart(false)}>Enter</button>
          </section>
          <Divider signsData={signsData} />
        </>
      ) : (
        <>
          <section className="today-info">
            <h2>About Today</h2>
            <p>Today is {formatDate(currentDate)}</p>
            <p>We are currently in {currentSignName} season</p>
            <p>
              {nextSignName} season starts on {formatDate(nextSignStartDate)}
            </p>
          </section>
          <Divider signsData={signsData} />
          <section className="sign-picker">
            {selectedSign ? (
              <SignInfo
                selectedSign={selectedSign}
                closeSignInfo={() => {
                  setSelectedSign(null);
                }}
              />
            ) : (
              <div className="sign-buttons">
                <h2>Zodiac Signs</h2>
                <p>Choose a sign to read its daily horoscope</p>
                <div className="buttons">
                  {signsData.map((sign) => (
                    <SignButton
                      key={sign.key}
                      name={sign.signName}
                      showSign={() => setSelectedSign(sign)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default App;

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  return date.toLocaleDateString("en-US", options);
};
