// import React, { useState } from "react";
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// // import { updatePassword } from "firebase/auth";
// import "./ForgotPassword.css"; // Custom styles

// // import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";

// import { EmailAuthProvider, reauthenticateWithCredential, updatePassword ,signInWithEmailAndPassword} from "firebase/auth";



// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [step, setStep] = useState(1);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const navigate = useNavigate();

//   const handleEmailSubmit = async () => {
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (!email) {
//       setErrorMessage("Please enter your email.");
//       return;
//     }

//     try {
//       await axios.post(`/auth/send-verification-code-to-resetPassword?email=${email}`);
//       setSuccessMessage("Verification code sent. Check your email.");
//       setStep(2);
//     } catch (error) {
//       setErrorMessage("Email not found. Please try again.");
//     }
//   };

//   const handleVerificationSubmit = async () => {
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (!verificationCode) {
//       setErrorMessage("Please enter the verification code.");
//       return;
//     }

//     setStep(3);
//   };

//   const handleResetPassword = async () => {
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (!newPassword) {
//       setErrorMessage("Please enter a new password.");
//       return;
//     }

//     try {
//       await axios.post(`/auth/resetPassword?email=${email}&verificationCode=${verificationCode}&newPassword=${newPassword}`);

//       const user = auth.currentUser;
//       if (user) {
//         await updatePassword(user, newPassword);
//       }

//       setSuccessMessage("Password reset successfully! Redirecting to login...");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (error) {
//       setErrorMessage("Failed to reset password. Try again.");
//     }
//   };


// //   const handleResetPassword = async () => {
// //     setErrorMessage("");
// //     setSuccessMessage("");

// //     if (!newPassword) {
// //       setErrorMessage("Please enter a new password.");
// //       return;
// //     }

// //     try {
// //       // ✅ 1. تعديل كلمة المرور في Spring Boot
// //       await axios.post(`/auth/resetPassword?email=${email}&verificationCode=${verificationCode}&newPassword=${newPassword}`);

// //       // ✅ 2. جلب المستخدم الحالي من Firebase
// //       const user = auth.currentUser;
// //       if (user) {
// //         // ✅ 3. إعادة المصادقة باستخدام البريد وكود التحقق (Spring Boot هو اللي بعث الكود، مش Firebase)
// //         const credential = EmailAuthProvider.credential(email, verificationCode);
// //         await reauthenticateWithCredential(user, credential);

// //         // ✅ 4. تحديث كلمة المرور في Firebase
// //         await updatePassword(user, newPassword);

// //         setSuccessMessage("Password reset successfully! Redirecting to login...");
// //         setTimeout(() => navigate("/login"), 2000);
// //       } else {
// //         setErrorMessage("No authenticated user found. Please try logging in again.");
// //       }
// //     } catch (error) {
// //       console.error("Error resetting password:", error.message);
// //       setErrorMessage("Failed to reset password. Try again.");
// //     }
// // };


//   return (
//     <div className="forgot-password-container">
//       <h2>Forgot Password</h2>
      
//       {step === 1 && (
//         <div className="step-container">
//           <p>Enter your email to receive a verification code.</p>
//           <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           <button onClick={handleEmailSubmit}>Next</button>
//         </div>
//       )}

//       {step === 2 && (
//         <div className="step-container">
//           <p>Enter the verification code sent to your email.</p>
//           <input type="text" placeholder="Enter verification code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
//           <button onClick={handleVerificationSubmit}>Next</button>
//         </div>
//       )}

//       {step === 3 && (
//         <div className="step-container">
//           <p>Enter your new password.</p>
//           <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
//           <button onClick={handleResetPassword}>Reset Password</button>
//         </div>
//       )}

//       {errorMessage && <p className="error-message">{errorMessage}</p>}
//       {successMessage && <p className="success-message">{successMessage}</p>}
//     </div>
//   );
// };

// export default ForgotPassword;
