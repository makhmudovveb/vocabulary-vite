import React, { useState, useEffect } from "react";
import { auth, db } from "../Firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./AuthModal.css";

const TEACHER_ACCOUNTS = {
  "aziza.ravshanovna@gmail.com": { fullName: "Aziza Ravshanovna", role: "teacher", password: "aziza_ravshanovna" },
  "bexzod.baxramovich@gmail.com": { fullName: "Bexzod Baxramovich", role: "teacher", password: "bexzod_baxramovich" },
  "mubina.marufovna@gmail.com": { fullName: "Mubina Marufovna", role: "teacher", password: "mubina_marufovna" },
  "nilufar.farruxovna@gmail.com": { fullName: "Nilufar Farruxovna", role: "teacher", password: "nilufar_farruxovna" },
  "olga.rudolfovna@gmail.com": { fullName: "Olga Rudolfovna", role: "teacher", password: "olga_rudolfovna" },
  "ozoda.baxramovna@gmail.com": { fullName: "Ozoda Baxramovna", role: "teacher", password: "ozoda_baxramovna" },
  "sevara.ismatillayevna@gmail.com": { fullName: "Sevara Ismatillayevna", role: "teacher", password: "sevara_ismatillayevna" },
  "sevara.muhitdinovna@gmail.com": { fullName: "Sevara Muhitdinovna", role: "teacher", password: "sevara_muhitdinovna" },
  "ziyoda.baxramovna@gmail.com": { fullName: "Ziyoda Baxramovna", role: "teacher", password: "ziyoda_baxramovna" },



  "mki.school@gmail.com": {
    fullName: "Mki School",
    role: "admin",
    password: "mki_school"
  }
};

export default function AuthModal({ onAuthSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [teacherSelect, setTeacherSelect] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");


  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);



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
      setMessage("Already registered");
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
      setMessage("Please recheck your details");
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

          value={teacherSelect}
          onChange={(e) => setTeacherSelect(e.target.value)}
        >
          <option value="" disabled hidden>-- Select your teacher --</option>
          <option value="Aziza Ravshanovna">Aziza Ravshanovna</option>
          <option value="Bexzod Baxramovich">Bexzod Baxramovich</option>
          <option value="Mubina Marufovna">Mubina Ma'rufovna</option>
          <option value="Nilufar Farruxovna">Nilufar Farruxovna</option>
          <option value="Olga Rudolfovna">Olga Rudolfovna</option>
          <option value="Ozoda Baxramovna">Ozoda Baxramovna</option>
          <option value="Sevara Ismatillayevna">Sevara Ismatillayevna</option>
          <option value="Bexzod Mahmudov">Sevara Muhitdinovna</option>
          <option value="Bexzod Mahmudov">Ziyoda Baxramovna</option>


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