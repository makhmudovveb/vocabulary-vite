import React, { useState, useEffect, useRef } from "react";
import "./Reading.css";

const Reading = () => {
  // ================= TIMER =================
  const [seconds, setSeconds] = useState(1200);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (s) => {
    const mins = String(Math.floor(s / 60)).padStart(2, "0");
    const secs = String(s % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const handleStart = () => setTimerRunning(true);
  const handlePause = () => {
    setTimerRunning(false);
    clearInterval(timerRef.current);
  };
  const handleReset = () => {
    setTimerRunning(false);
    clearInterval(timerRef.current);
    setSeconds(1200);
  };

  // ================= NIGHT MODE =================
  const [nightMode, setNightMode] = useState(false);
  useEffect(() => {
    if (nightMode) {
      document.body.classList.add("night-mode");
    } else {
      document.body.classList.remove("night-mode");
    }
  }, [nightMode]);

  // ================= ANSWERS =================
  const correctAnswers = {
    1: "FALSE",
    2: "FALSE",
    3: "NOT GIVEN",
    4: "TRUE",
    5: "FALSE",
    6: "TRUE",
    7: "fraudulent",
    8: "museums",
    9: "Cubism",
    10: "cinema",
    11: "workshop",
    12: "vases",
    13: "travelers",
  };

  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (q, value) => {
    setUserAnswers((prev) => ({ ...prev, [q]: value }));
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    Object.keys(correctAnswers).forEach((q) => {
      if (
        (userAnswers[q] || "").toLowerCase() ===
        correctAnswers[q].toLowerCase()
      ) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowFeedback(true);
    handlePause();
  };

  return (
    <div className="reading">
      <header>
        <div className="header-controls">
          <div className="timer-container">
            <i className="fas fa-clock"></i>
            <span id="timer">{formatTime(seconds)}</span>
            <div className="timer-controls">
              <button onClick={handleStart} title="Start">
                <i className="fas fa-play"></i>
              </button>
              <button onClick={handlePause} title="Pause">
                <i className="fas fa-pause"></i>
              </button>
              <button onClick={handleReset} title="Reset">
                <i className="fas fa-redo"></i>
              </button>
            </div>
          </div>
          <button
            className="mode-toggle"
            onClick={() => setNightMode(!nightMode)}
            title="Toggle Night Mode"
          >
            <i className={`fas ${nightMode ? "fa-sun" : "fa-moon"}`}></i>
          </button>
        </div>
      </header>

      <main>
        <div className="passage-container" id="passage-container">
          <div className="passage-content">
            <div className="passage-title">
              Studies in the History of Art and Visual Culture
            </div>
            <div className="passage-text" id="passage-text">
              <p>
                <b>General Information</b>
                <br />
                The Department of the History of Art, which operates within the
                Faculty of history, offers a one-year postgraduate course in the
                History of Art and Visual culture. We welcome applicants from a
                broad range of backgrounds and do not require students to have a
                first degree in art history. In addition to a compulsory course
                on Theory and Methods, students take two one-term optional
                courses, and write a 15,000 -word dissertation on a topic of
                their choice. The course aims to redefine art history and
                includes a broader range of objects and visual media than other
                art history courses. Images and objects produced in many
                contexts- ranging from the scientific to the popular- have been
                brought together to show how visual styles at different periods
                and in different places can be understood in relation to the
                aesthetic, intellectual and social facets of various cultures.
              </p>
              <p>
                <b>Theory and Methods</b>
                <br />
                This core course provides an advanced introduction to the major
                methodological issues and traditions of art history. The course
                is organised around a series of issues that relate to the
                production of art and people's responses to it. Students will
                discuss these issues and assigned readings in small weekly
                classes. In lectures, the tutors will consider works of art from
                a variety of cultures in order to demonstrate that context and
                artistic method are important aspects of art history.
              </p>
              <p>
                <b>Choosing Courses</b>
                <br />
                The optional courses listed below are not available every year
                and prospective students are advised to check on the
                availability of specific courses. Students should also note
                there may be some restrictions on combining particular courses
                within their degree programme. Students wishing to take a course
                that does not appear in the list but is offered by the Faculty
                of History will need to get permission from the relevant Course
                Tutor. An application should then be made by the candidate's
                supervisor.
              </p>
              <p>
                <b>Authenticity and Replication</b>
                <br />
                course is designed to give students exposure to a central issue
                of the visual arts in an explicitly inter-disciplinary and
                cross-cultural framework. It will use a series of case studies
                to explore the idea of 'the real' or 'the authentic 'in both
                images and objects. The historical and geographical contexts to
                be addressed will range widely, from ancient Greece and Rome, to
                early modern China and to contemporary art, including works seen
                as genuine as well as works regarded as fraudulent. The course
                will make particularly extensive use of trips to museums to view
                actual objects and Images.
              </p>
              <p>
                <b>French Painting 1880-1912</b>
                <br />
                The course examines the development of Post-impressionist
                painting between 1880 and 1912, at which point Cubism began to
                have a major impact on the thinking of French artists. Rather
                than tracing a history of styles or individuals, we consider how
                artistic practices were closely linked to contemporary
                developments. The rise of new forms of image distribution,
                including cinema, will be addressed, as well as the changing
                role of painting in the public sphere. The writings of artists
                and their contemporaries will be examined alongside recent
                art-historical work.
              </p>
              <p>
                <b>Medieval European Art</b>
                <br />
                This course addresses two problems central to the history of
                art: the roots of artistic invention, and suitable methods for
                instructing on technique. During this period, young, would-be
                artists acted as assistants to a master painter in his workshop.
                With this type of training, what was the scope for originality,
                and how was stylistic change encouraged? These issues are
                brought into sharp focus by the changing visual culture of
                late-medieval Europe, between the twelfth and the fifteenth
                centuries. The available literature on these themes is rich, yet
                inconsistent: the course therefore addresses questions that are
                very much open.
              </p>
              <p>
                <b>Reception of Classical European Art</b>
                <br />
                the fourteenth century the discovery of classical antiquities
                inspired contemporary artists, some copied closely, some
                restored the ancient in a contemporary style, while others
                reinterpreted freely. The course focuses on sculpture, painting
                and architecture in Britain, with a selection of other European
                works. Sculpture is examined in life-size marble statues, and in
                miniature with porcelain figurines. Painting is studied through
                the designs painted on vases, particularly Athenian and South
                Italian Architecture is examined through the ancient Greek
                temples that were excavated in the nineteenth century and also
                replicated in miniature for sale to travelers.
              </p>
              <p>
                <b>Women, Art and Culture in Early Modern Europe</b>
                <br />
                course will explore the various roles played by women in the
                production and reception of art and architecture in
                fifteenth-to seventeenth-century Europe. After many decades of
                relative neglect, the significance of the way women contributed
                to the art and culture of Early Modern Europe has come to light.
                By drawing on this wealth of new research, the course will
                examine the careers of professional women artists working in
                Northern and Southern Europe. We also consider how famous women
                patrons, such as Isabella d'Este and Catherine de Medici,
                influenced the careers of artists and wider perceptions about
                art. Another topic that will be addressed is the representation
                of women in the visual arts, for example as sitters for state
                portraits and marriage paintings.
              </p>
            </div>
          </div>
        </div>

        <div className="questions-container" id="questions-container">
  <div className="section-title">Questions 1-6</div>
  <div className="instructions">
    Do the following statements agree with the information given in Reading Passage 1?
  </div>
  <div className="instructions">
    In boxes 1-7 on your answer sheet, write:<br />
    TRUE - if the statement agrees with the information<br />
    FALSE - if the statement contradicts the information<br />
    NOT GIVEN - if there is no information on this
  </div>

  <div className="question-group">
    {/* Question 1 */}
    <div className="question" id="q1">
      <div className="question-title">
        <div className="question-number">1</div>
        <div className="question-text">
          Applicants to the department must have previously studied art history.
        </div>
      </div>
      <div className="options">
        <label className="option">
          <input type="radio" name="q1" value="TRUE" /> TRUE
        </label>
        <label className="option">
          <input type="radio" name="q1" value="FALSE" /> FALSE
        </label>
        <label className="option">
          <input type="radio" name="q1" value="NOT GIVEN" /> NOT GIVEN
        </label>
      </div>
    </div>

    {/* Question 2 */}
    <div className="question" id="q2">
      <div className="question-title">
        <div className="question-number">2</div>
        <div className="question-text">
          Students can choose two optional courses instead of the Theory and Methods course.
        </div>
      </div>
      <div className="options">
        <label className="option">
          <input type="radio" name="q2" value="TRUE" /> TRUE
        </label>
        <label className="option">
          <input type="radio" name="q2" value="FALSE" /> FALSE
        </label>
        <label className="option">
          <input type="radio" name="q2" value="NOT GIVEN" /> NOT GIVEN
        </label>
      </div>
    </div>

    {/* Question 3 */}
    <div className="question" id="q3">
      <div className="question-title">
        <div className="question-number">3</div>
        <div className="question-text">
          The course organisers had more problems collecting art objects from some historical periods than others.
        </div>
      </div>
      <div className="options">
        <label className="option">
          <input type="radio" name="q3" value="TRUE" /> TRUE
        </label>
        <label className="option">
          <input type="radio" name="q3" value="FALSE" /> FALSE
        </label>
        <label className="option">
          <input type="radio" name="q3" value="NOT GIVEN" /> NOT GIVEN
        </label>
      </div>
    </div>

    {/* Question 4 */}
    <div className="question" id="q4">
      <div className="question-title">
        <div className="question-number">4</div>
        <div className="question-text">
          The Theory and Methods course focuses on the way art is made and perceived.
        </div>
      </div>
      <div className="options">
        <label className="option">
          <input type="radio" name="q4" value="TRUE" /> TRUE
        </label>
        <label className="option">
          <input type="radio" name="q4" value="FALSE" /> FALSE
        </label>
        <label className="option">
          <input type="radio" name="q4" value="NOT GIVEN" /> NOT GIVEN
        </label>
      </div>
    </div>

    {/* Question 5 */}
    <div className="question" id="q5">
      <div className="question-title">
        <div className="question-number">5</div>
        <div className="question-text">
          Students will be able to do any of the optional courses that are listed.
        </div>
      </div>
      <div className="options">
        <label className="option">
          <input type="radio" name="q5" value="TRUE" /> TRUE
        </label>
        <label className="option">
          <input type="radio" name="q5" value="FALSE" /> FALSE
        </label>
        <label className="option">
          <input type="radio" name="q5" value="NOT GIVEN" /> NOT GIVEN
        </label>
      </div>
    </div>

    {/* Question 6 */}
    <div className="question" id="q6">
      <div className="question-title">
        <div className="question-number">6</div>
        <div className="question-text">
          Students may be able to take an unlisted course if they get the appropriate approval.
        </div>
      </div>
      <div className="options">
        <label className="option">
          <input type="radio" name="q6" value="TRUE" /> TRUE
        </label>
        <label className="option">
          <input type="radio" name="q6" value="FALSE" /> FALSE
        </label>
        <label className="option">
          <input type="radio" name="q6" value="NOT GIVEN" /> NOT GIVEN
        </label>
      </div>
    </div>
  </div>

  {/* Questions 7-13 */}
  <div className="section-title">Questions 7-13</div>
  <div className="instructions">
    Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.
  </div>

  <div className="question-group">
    <div className="question" id="q7">
      <div className="question-title">
        <div className="question-number">7</div>
        <div className="question-text">
          Optional courses<br />
          Authenticity and Replication<br />
          genuine art is studied in addition to that considered
          <input type="text" name="q7" className="fill-in-the-blank" />.
        </div>
      </div>
    </div>

    <div className="question" id="q8">
      <div className="question-title">
        <div className="question-number">8</div>
        <div className="question-text">
          Art objects are studied in
          <input type="text" name="q8" className="fill-in-the-blank" />.
        </div>
      </div>
    </div>

    <div className="question" id="q9">
      <div className="question-title">
        <div className="question-number">9</div>
        <div className="question-text">
          French Painting 1880-1912<br />
          - the course covers the period up to when
          <input type="text" name="q9" className="fill-in-the-blank" />
          started to be prominent
        </div>
      </div>
    </div>

    <div className="question" id="q10">
      <div className="question-title">
        <div className="question-number">10</div>
        <div className="question-text">
          the course looks at the connections between art and new developments
          such as
          <input type="text" name="q10" className="fill-in-the-blank" />.
        </div>
      </div>
    </div>

    <div className="question" id="q11">
      <div className="question-title">
        <div className="question-number">11</div>
        <div className="question-text">
          <p>Medieval European Art</p>
          <p>
            - the course looks at two issues: artistic creativity and processes
            for teaching technique
          </p>
          - the course considers how artists could be original when taught by
          an expert in a
          <input type="text" name="q11" className="fill-in-the-blank" />.
        </div>
      </div>
    </div>

    <div className="question" id="q12">
      <div className="question-title">
        <div className="question-number">12</div>
        <div className="question-text">
          <p>Reception of Classical European Art</p>
          <p>- life-sized and miniature sculpture is examined</p>
          <p>- painting is examined by looking at the decoration of</p>
          <input type="text" name="q12" className="fill-in-the-blank" />.
        </div>
      </div>
    </div>

    <div className="question" id="q13">
      <div className="question-title">
        <div className="question-number">13</div>
        <div className="question-text">
          architecture is assessed by studying 19th century models bought by
          <input type="text" name="q13" className="fill-in-the-blank" />.
        </div>
      </div>
    </div>
  </div>
</div>
      </main>

      <footer>
        <div className="progress-container" id="progress-container"></div>
        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleResetAnswers}>
            Reset Answers
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Submit Answers
          </button>
        </div>
      </footer>

      {showFeedback && (
        <div className="feedback-overlay">
          <div className="feedback-container">
            <div className="feedback-header">
              <div className="feedback-title">
                <i className="fas fa-chart-bar"></i> Your Results
                <span className="score-display">{score}/13</span>
              </div>
              <button onClick={() => setShowFeedback(false)} title="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="feedback-body">
              {Object.keys(correctAnswers).map((q) => {
                const userAns = userAnswers[q] || "Not answered";
                const correct =
                  userAns.toLowerCase() === correctAnswers[q].toLowerCase();
                return (
                  <div key={q} className="feedback-item">
                    <div className="feedback-question">
                      <span className={correct ? "correct" : "incorrect"}>
                        Question {q}:
                      </span>
                      {correct ? (
                        <i className="fas fa-check correct"></i>
                      ) : (
                        <i className="fas fa-times incorrect"></i>
                      )}
                    </div>
                    <div className="feedback-answer">
                      <strong>Your answer:</strong> {userAns}
                      {!correct && (
                        <div>
                          <strong>Correct answer:</strong> {correctAnswers[q]}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reading;
