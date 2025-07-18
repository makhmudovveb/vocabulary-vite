import React, { useState } from "react";
import { auth, db } from "../Firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./AuthModal.css";

const TEACHER_ACCOUNTS = {
  "bexzod.mahmudov@gmail.com": { fullName: "Bexzod Mahmudov", role: "teacher", password : "beka123"},
  "admin.mki@gmail.com": {
    fullName: "Admin MKI",
    role: "admin",
    password: "adminkmi123"
  }
};

export default function AuthModal({ onAuthSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [teacherSelect, setTeacherSelect] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!firstName || !lastName || !password || !teacherSelect) {
      setMessage("Please fill in all fields.");
      return;
    }
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", user.uid), {
        fullName: `${firstName} ${lastName}`,
        role: "student",
        teacher: teacherSelect,
        createdAt: new Date()
      });

      onAuthSuccess();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogin = async () => {
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        const account = TEACHER_ACCOUNTS[email];
        if (account) {
          await setDoc(docRef, {
            fullName: account.fullName,
            role: account.role
          });
        } else {
          throw new Error("Account not found.");
        }
      }

      onAuthSuccess();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content auth-content">
        <img src="/images/favicon.ico" alt="Site Icon" className="site-icon" />
        <h2>Register / Login</h2>

        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <select
        disabledvalue={teacherSelect}
          value={teacherSelect}
          onChange={(e) => setTeacherSelect(e.target.value)}
        >
          <option value="" disabled hidden>-- Select your teacher --</option>
          <option value="Bexzod Mahmudov">Bexzod Mahmudov</option>
          
        </select>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          Show password
        </label>

        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Log In</button>
        <p style={{ color: "red", fontSize: "0.9em" }}>{message}</p>
      </div>
    </div>
  );
}
