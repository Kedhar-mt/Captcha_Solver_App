import React, { useState, useEffect } from "react";
import Confetti from 'react-confetti';  // Import the Confetti component

const App = () => {
  const [captcha, setCaptcha] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);  // State to track the streak
  const [showConfetti, setShowConfetti] = useState(false); // State to show confetti
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const importantNotes = [
    "All words are case sensitive.",
    "Calculative CAPTCHAs must be solved.",
    "Length of the CAPTCHAs will be between 6 to 12 characters.",
    "The result can be negative numbers (e.g., 5 - 8 = -3).",
  ];

  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaString = "";
    const length = Math.floor(Math.random() * (12 - 6 + 1)) + 6; // Random length between 6 and 12
    for (let i = 0; i < length; i++) {
      captchaString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return captchaString;
  };

  // Load coins and streak from localStorage when the component mounts
  useEffect(() => {
    const savedCoins = localStorage.getItem("coins");
    const savedStreak = localStorage.getItem("streak");
    if (savedCoins) {
      setCoins(Number(savedCoins)); // Set coins from localStorage if available
    }
    if (savedStreak) {
      setStreak(Number(savedStreak)); // Set streak from localStorage if available
    }

    const newCaptcha = generateCaptcha(); // Generate an initial CAPTCHA
    setCaptcha(newCaptcha); // Set the CAPTCHA text
  }, []);

  // Save coins and streak to localStorage whenever they change
  useEffect(() => {
    if (coins !== 0) {
      localStorage.setItem("coins", coins); // Save the updated coins to localStorage
    }
    if (streak !== 0) {
      localStorage.setItem("streak", streak); // Save the updated streak to localStorage
    }
  }, [coins, streak]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message

    if (!userAnswer) {
      setErrorMessage("Please enter the CAPTCHA answer."); // Set error message if input is empty
      return;
    }

    console.log("User Answer:", userAnswer);
    console.log("Captcha:", captcha);

    if (userAnswer === captcha) {
      // Correct CAPTCHA logic
      const newCoins = coins + 10;
      setCoins(newCoins);

      // Increment streak for correct answer
      setStreak(streak + 1);

      console.log("Coins updated:", newCoins);

      // Trigger confetti animation after correct CAPTCHA
      setShowConfetti(true);

      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    } else {
      setErrorMessage("Incorrect CAPTCHA, try again.");

      // Reset streak if answer is incorrect
      setStreak(0);
    }

    // Generate a new CAPTCHA after submission
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setUserAnswer(""); // Clear the input field
  };

  const handleSkip = () => {
    const newCaptcha = generateCaptcha(); // Generate a new CAPTCHA
    setCaptcha(newCaptcha); // Update the CAPTCHA text
    setUserAnswer(""); // Clear the input field

    // Reset streak if CAPTCHA is skipped
    setStreak(0);
  };

  return (
    <div className="captcha-solver">
      {showConfetti && <Confetti />} {/* Show confetti when CAPTCHA is solved */}
      <h1>Captcha Solver</h1> {/* No username */}
      <div>
        <div className="captcha-display">
          {captcha}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="captcha-input"
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter CAPTCHA answer"
          />
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
        <button className="skip-button" onClick={handleSkip}>
          Skip
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      </div>
      <div className="coins-streak-container">
        {/* Coin Balance with Coin Emoji */}
        <p className="coin-balance">
          <span>Coins:</span>
          {coins} <span role="img" aria-label="coin">💰</span>
        </p>

        {/* Streak with Fire Emoji */}
        <p className="streak">
          <span>Streak:</span>
          {streak} <span role="img" aria-label="fire" className="fire-emoji">🔥</span>
        </p>
      </div>
      <div>
        <h3>Important Notes:</h3>
        <ul className="important-notes">
          {importantNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
