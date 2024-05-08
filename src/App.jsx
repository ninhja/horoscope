import "./App.css";
import horoscopeData from "./data/Data";
import { useState, useEffect } from "react";

const Fetch = (sign) => {
  const [horoscopeData, setHoroscopeData] = useState(null);

  useEffect(() => {
    const url = `https://horoscope19.p.rapidapi.com/get-horoscope/daily?sign=${
      sign.sign.signName
    }&day=${"today"}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "51ef241501mshb5ecea6765e17a1p1daa6djsn6134398b786d",
        "X-RapidAPI-Host": "horoscope19.p.rapidapi.com",
      },
    };

    fetch(url, options)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setHoroscopeData(data);
      });
  }, []);

  return <>{horoscopeData && horoscopeData.data.horoscope_data}</>;
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

const SignInfo = ({ sign, closeSignInfo, introText }) => {
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
        <p>Today's Horoscope: {sign.dailyHoroscope}</p>
      </div>
      <button onClick={closeSignInfo}>Go back</button>
    </div>
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
    // We have to offset the date in order to prevent an off-by-one error.
    // The issue is, when we set a date with the Date Picker input,
    // that date is automatically set in GMT (UTC) timezone.
    // Then it gets converted to a Date object, and Javascript shifts it
    // to our local time zone. In my case, that becomes the PST California
    // time zone. With the timezone offset, the date could now be a day
    // before or after the date we originally set. So, we need to offset
    // the date by adding back the amount that the date/time was offset.
    // https://www.youtube.com/watch?v=oKFb2Us9kmg
    // https://stackoverflow.com/questions/32469269/javascript-date-give-wrong-date-off-by-one-hour
    //https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const zodiacSign = signsData.find((sign) => {
      const startDate = new Date(sign.startDate + " " + date.getFullYear());
      const endDate = new Date(sign.endDate + " " + date.getFullYear());

      console.log("FINDING SIGN FOR " + date);
      console.log("STARTING DATE " + startDate);
      console.log("ENDING DATE " + endDate);
      console.log("");
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
    let userDate = new Date(formData.birthDate);
    let sign = findSign(userDate);
    setPersonalSign(sign);
    setFormData({ birthDate: "" });
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
          <section>{selectedSign && <Fetch sign={selectedSign} />}</section>
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
