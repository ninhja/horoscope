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

function App() {
  const [selectedSign, setSelectedSign] = useState(null);

  // get today's date and format it nicely
  const currentDate = new Date();
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  // get the astrology sign data object
  const signsData = horoscopeData.horoscopes.astroSigns;

  // get the zodiac sign data based on a given date
  function findZodiacSign(date) {
    const zodiacSign = signsData.find((sign) => {
      const startDate = new Date(
        sign.startDate + " " + currentDate.getFullYear()
      );
      const endDate = new Date(sign.endDate + " " + currentDate.getFullYear());
      return date >= startDate && date <= endDate;
    });
    return zodiacSign;
  }

  const currentZodiacSignData = findZodiacSign(currentDate);
  const currentSign = currentZodiacSignData.signName;

  return (
    <>
      <h1>Horoscopes</h1>
      <div className="today-info">
        <h2>About Today</h2>
        <p>The current date is {formattedDate}</p>
        <p>We are currently in {currentSign} season</p>
      </div>
      <div className="sign-picker">
        {selectedSign ? (
          <div>
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
            <button
              onClick={() => {
                setSelectedSign(null);
              }}
            >
              Choose another sign
            </button>
          </div>
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
      </div>
    </>
  );
}

export default App;
