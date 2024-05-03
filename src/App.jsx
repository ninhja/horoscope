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

const SignInfo = ({ selectedSign, closeSignInfo, introText }) => {
  return (
    <>
      <p>{introText}</p>
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
      <button onClick={closeSignInfo}>Go back</button>
    </>
  );
};

function App() {
  const [showStart, setShowStart] = useState(true);
  const [selectedSign, setSelectedSign] = useState(null);

  const [formData, setFormData] = useState({ birthDate: "" });
  const [personalSign, setPersonalSign] = useState(null);

  // get the astrology sign data object
  const signsData = horoscopeData.horoscopes.astroSigns;

  // get the zodiac sign data based on a given date
  function findSign(date) {
    const zodiacSign = signsData.find((sign) => {
      const startDate = new Date(
        sign.startDate + " " + currentDate.getFullYear()
      );
      const endDate = new Date(sign.endDate + " " + currentDate.getFullYear());
      console.log("date", date);
      console.log("startDate", startDate);
      console.log("endDate", endDate);
      return date >= startDate && date <= endDate;
    });
    console.log(zodiacSign, date);
    return zodiacSign;
  }

  // get today's date and format it nicely
  const currentDate = new Date();
  const currentSign = findSign(currentDate);

  const nextSignStartDate = new Date(
    currentSign.endDate + " " + currentDate.getFullYear()
  );
  nextSignStartDate.setDate(nextSignStartDate.getDate() + 1);
  const nextSignName = findSign(nextSignStartDate).signName;

  // Update the state when input values change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let userDate = new Date(formData.birthDate);
    console.log("userDate", userDate);
    let sign = findSign(userDate);
    setPersonalSign(sign);
    // You can perform additional actions with the form data here
    console.log("Form submitted:", formData, sign);
  };

  return (
    <>
      <h1>Horoscopes</h1>

      {showStart ? (
        <>
          <section className="welcome">
            <p>Welcome.</p>
            <p>
              Click enter to learn about the twelve zodiac signs and their daily
              horoscopes.
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
            <p>We are currently in {currentSign.signName} season</p>
            <p>
              {nextSignName} season starts on {formatDate(nextSignStartDate)}
            </p>
          </section>
          <Divider signsData={signsData} />
          <section className="form-wrapper">
            {personalSign ? (
              <SignInfo
                selectedSign={personalSign}
                closeSignInfo={() => {
                  setPersonalSign(null);
                }}
                introText={"Your sign is..."}
              />
            ) : (
              <>
                <h2>What's Your Sign?</h2>
                <form onSubmit={handleSubmit}>
                  <label>Enter your birthday to learn your zodiac sign.</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  ></input>
                  <button type="submit">Submit</button>
                </form>
              </>
            )}
          </section>
          <Divider signsData={signsData} />
          <section className="sign-picker">
            {selectedSign ? (
              <SignInfo
                selectedSign={selectedSign}
                closeSignInfo={() => {
                  setSelectedSign(null);
                }}
                introText={"You've chosen..."}
              />
            ) : (
              <div className="sign-buttons">
                <h2>All Zodiac Signs</h2>
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
