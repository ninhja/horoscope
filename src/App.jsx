import "./App.css";
import horoscopeData from "./data/Data";
import { useState } from "react";

const SignButton = ({ name, showSign }) => {
  return (
    <>
      <button className="sign-card" onClick={showSign}>
        {name}
      </button>
    </>
  );
};

const SignInfo = ({ signData }) => {
  return (
    <>
      <h2>{signData.signName}</h2>
      <div>
        <p>
          {signData.startDate} — {signData.endDate}
        </p>
        <p>Lucky numbers: {signData.luckyNumbers.toString()}</p>
        <p>Today's Horoscope: {signData.dailyHoroscope}</p>
      </div>
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
      <div className="today-info">
        <p>Today's date is {formattedDate}</p>
        <p>The current Zodiac Sign is {currentSign}</p>
      </div>
      <div className="sign-picker">
        <p>Choose a sign to learn more</p>
        <div className="cards">
          {signsData.map((sign) => (
            <SignButton
              key={sign.key}
              name={sign.signName}
              showSign={() => setSelectedSign(sign)}
            />
          ))}
        </div>
      </div>
      {selectedSign && (
        <div className="selected-sign">
          <SignInfo signData={selectedSign} />
        </div>
      )}
    </>
  );
}

export default App;
