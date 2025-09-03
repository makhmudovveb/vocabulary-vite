import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";
import AuthModal from "../Components/AuthModal";
import "../Styles/Landing.css";
import "../Styles/NewFeatures.css";

import { Gamepad } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(true);

  // 🔁 Следим за авторизацией
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // залогинен в Firebase → модалку скрываем
        setShowAuthModal(false);
      } else {
        // нет Firebase-пользователя → проверяем localStorage
        const guestData = localStorage.getItem("guestUser");
        if (guestData) {
          setShowAuthModal(false); // в guest mode тоже не показываем
        } else {
          setShowAuthModal(true); // гость не выбран и не залогинен → открываем
        }
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="landing-page">
      {showAuthModal && (
        <AuthModal onAuthSuccess={() => setShowAuthModal(false)} />
      )}


      <h1 className="landing-title">Welcome to Vocabulary Games!</h1>

      <div className="game-card-container">
        <Link to="/quiz" className="game-card active ">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" /></svg>

          <h2>Quiz</h2>
        </Link>

        <Link to="/cuecard" className="game-card active ">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" /></svg>

          <h2>Cue Card</h2>
        </Link>

        <Link to="/matching" className="game-card active ">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M120-272q0-16 10.5-27t25.5-11q8 0 15.5 2.5T186-300q13 8 26 14t28 6q33 0 56.5-23.5T320-360q0-33-23.5-56.5T240-440q-15 0-29 5t-25 15q-6 5-14 7.5t-16 2.5q-15 0-25.5-11T120-448v-152q0-17 11.5-28.5T160-640h150q-5-15-7.5-30t-2.5-30q0-75 52.5-127.5T480-880q75 0 127.5 52.5T660-700q0 15-2.5 30t-7.5 30h150q17 0 28.5 11.5T840-600v152q0 17-11.5 28.5T800-408q-8 0-14-3.5t-12-8.5q-11-10-25-15t-29-5q-33 0-56.5 23.5T640-360q0 33 23.5 56.5T720-280q15 0 29-5t25-15q5-5 11.5-8.5T800-312q17 0 28.5 11.5T840-272v152q0 17-11.5 28.5T800-80H160q-17 0-28.5-11.5T120-120v-152Zm80 112h560v-46q-10 3-19.5 4.5T720-200q-66 0-113-47t-47-113q0-66 47-113t113-47q11 0 20.5 1.5T760-514v-46H578q-17 0-28.5-11T538-598q0-8 2.5-16.5T550-628q17-12 23.5-31.5T580-700q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 21 6.5 40.5T410-628q7 5 9.5 12.5T422-600q0 17-11.5 28.5T382-560H200v46q10-3 19.5-4.5T240-520q66 0 113 47t47 113q0 66-47 113t-113 47q-11 0-20.5-1.5T200-206v46Zm280-320Z" /></svg>

          <h2>Matching</h2>
        </Link>

        <Link to="/spelling-game" className="game-card active status-new-feature">
          <Gamepad size={48} />
          <h2>Game</h2>
        </Link>

        <Link to="/ielts" className="game-card active status-new-feature">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm-50-100 160-100-160-100v200Zm-430 20v-480 480Z" /></svg>
          <h2>IELTS</h2>
          <span>Coming soon</span>

        </Link>
        <Link to="/speaking" className="game-card active status-new-feature">
          <svg fill="#16386e" height="50px" width="50px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 297 297" xmlSpace="preserve">
            <g>
              <path d="M194.388,69.011c-3.922,3.917-3.924,10.271-0.005,14.192c26.363,26.382,26.347,69.324-0.038,95.724
		c-3.918,3.923-3.916,10.275,0.004,14.194c1.961,1.958,4.527,2.938,7.096,2.938c2.569,0,5.139-0.982,7.099-2.942
		c34.202-34.224,34.219-89.895,0.037-124.103C204.664,65.095,198.308,65.091,194.388,69.011z"/>
              <path d="M156.868,97.801c-3.921,3.916-3.923,10.271-0.005,14.191c10.51,10.519,10.509,27.633-0.002,38.151
		c-3.918,3.92-3.916,10.275,0.005,14.193c1.959,1.959,4.527,2.937,7.094,2.937c2.57,0,5.14-0.98,7.099-2.942
		c18.329-18.341,18.33-48.186,0.002-66.526C167.144,93.882,160.788,93.88,156.868,97.801z"/>
              <path d="M253.01,24.56c-3.918-3.922-10.272-3.924-14.192-0.006c-3.922,3.918-3.924,10.273-0.005,14.193
		c50.854,50.887,50.832,133.707-0.052,184.618c-3.919,3.92-3.917,10.275,0.004,14.193c1.96,1.958,4.526,2.938,7.095,2.938
		c2.568,0,5.139-0.982,7.099-2.942C311.661,178.82,311.684,83.27,253.01,24.56z"/>
              <path d="M73.015,195.793c25.803-1.778,46.258-23.349,46.258-49.627c0-27.437-22.297-49.757-49.704-49.757
		c-27.407,0-49.705,22.32-49.705,49.757c0,26.276,20.454,47.847,46.259,49.627c-19.32,0.743-36.335,7.723-48.193,19.86
		C5.747,228.122-0.444,245.386,0.025,265.581c0.127,5.449,4.581,9.803,10.033,9.803H129.07c5.452,0,9.907-4.354,10.033-9.805
		c0.469-20.196-5.724-37.462-17.907-49.931C109.339,203.514,92.331,196.536,73.015,195.793z M39.936,146.166
		c0-16.367,13.293-29.685,29.633-29.685c16.34,0,29.632,13.317,29.632,29.685c0,16.37-13.292,29.688-29.632,29.688
		C53.229,175.854,39.936,162.536,39.936,146.166z M20.559,255.311c1.307-10.39,5.233-18.983,11.729-25.63
		c8.75-8.956,21.99-13.888,37.279-13.888c15.288,0,28.524,4.93,37.272,13.884c6.495,6.646,10.423,15.242,11.729,25.634H20.559z"/>
            </g>
          </svg>

          <h2>Speaking</h2>
          <p>Available only for computers</p>
        </Link>
        <Link to="/typing" className="game-card status-new-feature">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" /></svg>

          <h2>Typing</h2>
          <p>Available only for computers</p>

        </Link>
        <Link to="/#" className="game-card coming-soon ">
          <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#16386e"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" /></svg>

          <h2>New features soon</h2>
        </Link>
      </div>
    </div>
  );
}
  