import React, { useState } from "react";
import { auth } from "../config/firebaseInit";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneVerification = ({ onVerified }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(0); // 0: enter phone, 1: enter OTP
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
        window.recaptchaVerifier.render();
      } catch (err) {
        setError("Recaptcha setup failed: " + err.message);
      }
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setupRecaptcha();
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmation(confirmationResult);
      setStep(1);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();
      onVerified(idToken, phone);
    } catch (err) {
      setError("Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Phone Verification</h2>
      {step === 0 && (
        <form onSubmit={handleSendOtp}>
          <input
            type="tel"
            placeholder="Enter phone number (+1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <div id="recaptcha-container" />
          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}
      {step === 1 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default PhoneVerification;
