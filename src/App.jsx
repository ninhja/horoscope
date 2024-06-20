import "./App.css";
import horoscopeData from "./data/Data";
import { useState, useEffect } from "react";

const Divider = ({ signsData }) => {
  return (
    <div className="divider">
      {signsData.map((sign) => (
        <img key={sign.key} src={sign.img} />
      ))}
    </div>
  );
};

const SignInfo = ({ sign, closeSignInfo, introText }) => {
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // API documentation: https://rapidapi.com/ashutosh.devil7/api/horoscope19/

  useEffect(() => {
    setIsLoading(true);
    const url = `https://horoscope19.p.rapidapi.com/get-horoscope/daily?sign=${
      sign.signName
    }&day=${"today"}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "51ef241501mshb5ecea6765e17a1p1daa6djsn6134398b786d",
        "X-RapidAPI-Host": "horoscope19.p.rapidapi.com",
      },
    };

    const fetchDailyHoroscopeData = async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dailyHoroscopeData = await response.json();

      console.log(dailyHoroscopeData);
      setHoroscopeData(dailyHoroscopeData);
      setIsLoading(false);
    };

    fetchDailyHoroscopeData();
  }, [sign]);

  return (
    <div className="sign-info">
      <p>{introText}</p>
      <h2>{sign.signName}</h2>
      <img src={sign.img} alt={`${sign.signName} zodiac sign symbol`} />
      <div>
        <p>
          {sign.startDate} — {sign.endDate}
        </p>
        <p>Lucky numbers: {sign.luckyNumbers.toString()}</p>
        <p>Key traits: {sign.traits}</p>
        {/* <p>Today's Horoscope: {sign.dailyHoroscope}</p> */}
        <p>
          Today's Horoscope:{" "}
          {isLoading
            ? "..."
            : horoscopeData && horoscopeData.data.horoscope_data}
        </p>
      </div>
      <button onClick={closeSignInfo}>Go back</button>
    </div>
  );
};

function App() {
  const [showWelcomePage, setShowWelcomePage] = useState(true);
  const [selectedSign, setSelectedSign] = useState(null);

  const [formData, setFormData] = useState({ birthDate: "" });
  const [personalSign, setPersonalSign] = useState(null);

  // get the astrology sign data object
  const signsData = horoscopeData.horoscopes.astroSigns;

  // get the zodiac sign data based on a given date
  function findSign(date) {
    if (date === null) console.log("Invalid date");

    const zodiacSign = signsData.find((sign) => {
      const startDate = new Date(
        `${sign.startDate}, ${date.getFullYear()}, 00:00:00`
      );
      const endDate = new Date(
        `${sign.endDate}, ${date.getFullYear()}, 23:59:59`
      );

      return date >= startDate && date <= endDate;
    });
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
    if (!formData.birthDate) {
      alert("Invalid date. Please input a valid birthday.");
      return;
    }
    let userBirthDate = new Date(formData.birthDate);
    let userSign = findSign(userBirthDate);
    setPersonalSign(userSign);
    setFormData({ birthDate: "" });
  };

  return (
    <>
      <h1>Horoscopes</h1>

      {showWelcomePage ? (
        <>
          <section className="welcome">
            <p>Welcome.</p>
            <p>
              Click enter to learn about the twelve zodiac signs and their daily
              horoscopes.
            </p>
            <button onClick={() => setShowWelcomePage(false)}>Enter</button>
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
                sign={personalSign}
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
                sign={selectedSign}
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
                    <button
                      key={sign.key}
                      className="sign-button"
                      onClick={() => setSelectedSign(sign)}
                    >
                      {sign.signName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
          <Divider signsData={signsData} />
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
