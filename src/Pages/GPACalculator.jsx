import { Fragment, useRef, useState } from "react";
import "../styles/gpaCalculator.css";
import DeleteIcon from "../Icons/DeleteIcon";
import AlertModel from "../components/AlertModel";

export default function GPACalculator() {
  const [modalOpen, setModalOpen] = useState(false);
  const inputHours = useRef(null);
  const inputGrade = useRef(null);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [creditsHours, setCreditsHours] = useState("");
  const [grade, setGrade] = useState("");
  const [errorCourseName, setErrorCourseName] = useState(false);
  const [errorCreditsHours, setErrorCreditsHours] = useState(false);
  const [errorGrade, setErrorGrade] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [resultCalc, setResultCalc] = useState("");

  const grades = [
    { name: "A+", value: 4 },
    { name: "A", value: 3.667 },
    { name: "B+", value: 3.333 },
    { name: "B", value: 3 },
    { name: "B-", value: 2.667 },
    { name: "C+", value: 2.333 },
    { name: "C", value: 2 },
    { name: "F", value: 0 },
  ];

  const closeDialog = () => {
    setModalOpen(false);
  };

  const vildation = () => {
    let valid = false;
    const validName = /^[a-zA-Z][a-zA-Z0-9]/;
    if (!validName.test(courseName)) {
      setErrorCourseName(true);
    }
    if (creditsHours === "" || creditsHours === null) {
      setErrorCreditsHours(true);
    }
    if (grade === "" || grade === null) {
      setErrorGrade(true);
    }
    if (!validName.test(courseName) || creditsHours === "" || grade === "") {
      return valid;
    }
    return (valid = true);
  };

  const calcResult = (courses) => {
    let calcTotalHours = 0;
    let calcHoursAndGrade = 0;
    let calcResult = 0;

    courses.forEach((course) => {
      calcTotalHours += +course.hour;
      const gradeValue = grades.find((grade) => grade.name === course.grade);
      calcHoursAndGrade += +course.hour * gradeValue.value;
      calcResult = (calcHoursAndGrade / calcTotalHours).toFixed(3);
    });

    setResultCalc(calcResult);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputHours.current.classList.contains("open"))
      inputHours.current.click();
    if (inputGrade.current.classList.contains("open"))
      inputGrade.current.click();

    if (!vildation()) return;

    const addCourse = [
      {
        id: `${courseName}-${Date.now()}`,
        name: courseName,
        hour: creditsHours,
        grade: grade,
      },
      ...courses,
    ];

    calcResult(addCourse);
    setCourses(addCourse);
    setShowCourses(true);
    setCourseName("");
    setCreditsHours(null);
    setGrade("");
  };

  const handleDelete = (id) => {
    const deleteCourse = courses.filter((to) => to.id !== id);
    calcResult(deleteCourse);
    setCourses(deleteCourse);
    setCourseId(null);
    closeDialog();
    setCourseName("");
    setCreditsHours("");
    setGrade("");
    if (deleteCourse.length < 1) setShowCourses(false);
  };

  const handleIputBox = (e) => {
    let list;
    if (e.target.id === "Hours") {
      inputHours.current.classList.toggle("open");
      list = inputHours.current.nextElementSibling;
    } else {
      inputGrade.current.classList.toggle("open");
      list = inputGrade.current.nextElementSibling;
    }

    if (list.style.maxHeight) {
      list.style.maxHeight = null;
    } else {
      list.style.maxHeight = "200px";
      list.style.height = list.scrollHeight + "px";
      list.style.overflow = "auto";
    }
    setErrorGrade(false);
    setErrorCreditsHours(false);
  };

  const handleHourChange = (e) => {
    if (e.target.id === "empty1") {
      setCreditsHours(null);
    } else {
      setCreditsHours(e.target.nextElementSibling.innerHTML || "");
    }
    setErrorCreditsHours(false);
    inputHours.current.click();
  };

  const handleGradeChange = (e) => {
    if (e.target.id === "empty") {
      setGrade(null);
    } else {
      setGrade(e.target.nextElementSibling.innerHTML || "");
    }
    setErrorGrade(false);
    inputGrade.current.click();
  };

  return (
    <section className="gpa-calculator">
      <article className="content-title">
        <h2>GPA Calculator</h2>
        <p>You can view your account settings</p>
      </article>

      <div className="adding">
        <form onSubmit={handleSubmit} className="add-task">
          <label htmlFor="name" style={{ flexDirection: "column" }}>
            Course name
            <input
              style={{ marginTop: "0.5rem" }}
              className={`value-input ${errorCourseName && "error-input"}`}
              type="text"
              id="name"
              value={courseName}
              placeholder="Distributed accounts"
              onChange={(e) => {
                setCourseName(e.target.value);
                setErrorCourseName(false);
              }}
            />
          </label>

          <div className="dropdown">
            <div className="title">Credits hours</div>
            <div
              ref={inputHours}
              id="Hours"
              className={`hours input-box ${
                errorCreditsHours ? "error-input" : ""
              } ${!creditsHours ? "first-option" : ""}`}
              onClick={handleIputBox}
            >
              {creditsHours ? creditsHours : "Select Hours"}
            </div>

            <div className="list">
              {!creditsHours ? (
                <input
                  type="radio"
                  name="drop1"
                  id="empty1"
                  className="radio"
                  onChange={handleHourChange}
                  checked
                />
              ) : (
                <input
                  type="radio"
                  name="drop1"
                  id="empty1"
                  className="radio"
                  onChange={handleHourChange}
                />
              )}
              <label htmlFor="empty1">Select Hours</label>

              {[1, 2, 3, 4].map((item) => (
                <Fragment key={item}>
                  <input
                    type="radio"
                    name="drop1"
                    id={`id${item}`}
                    className="radio"
                    onChange={handleHourChange}
                    checked={creditsHours == item ? true : false}
                  />
                  <label htmlFor={`id${item}`}>{item}</label>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="dropdown">
            <div className="title">Grade</div>
            <div
              ref={inputGrade}
              id="Grade"
              className={`input-box ${errorGrade && "error-input"} ${
                !grade ? "first-option" : ""
              }`}
              onClick={handleIputBox}
            >
              {grade ? grade : "Select Grade"}
            </div>

            <div className="list">
              {!grade ? (
                <input
                  type="radio"
                  name="drop2"
                  id="empty"
                  className="radio"
                  onChange={handleGradeChange}
                  checked
                />
              ) : (
                <input
                  type="radio"
                  name="drop2"
                  id="empty"
                  className="radio"
                  onChange={handleGradeChange}
                />
              )}
              <label htmlFor="empty">Select Grade</label>

              {grades.map(({ name }) => (
                <Fragment key={name}>
                  <input
                    type="radio"
                    name="drop2"
                    id={`id${name}`}
                    className="radio"
                    onChange={handleGradeChange}
                    checked={grade == name ? true : false}
                  />
                  <label htmlFor={`id${name}`}>{name}</label>
                </Fragment>
              ))}
            </div>
          </div>

          <button className="btn-add" type="submit">
            Add
          </button>
        </form>
      </div>
      {showCourses && (
        <>
          <div className="tasks">
            <div className="bar-tasks">
              <h2>Courses list</h2>
            </div>

            <div className="responsive-table">
              <table className="gpa-table">
                <thead>
                  <tr>
                    <th className="course-name">Course name</th>
                    <th>Credits hours</th>
                    <th>Course grading</th>
                    <th></th>
                  </tr>
                </thead>
              </table>

              <div className="tbl-content">
                <table className="gpa-table">
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="tr-item">
                        <td className="course-name">{course.name}</td>
                        <td>{course.hour}</td>
                        <td>{course.grade}</td>
                        <td>
                          <DeleteIcon
                            className="trash"
                            onClick={() => {
                              setModalOpen(true);
                              setCourseId(course.id);
                              if (inputHours.current.classList.contains("open"))
                                inputHours.current.click();
                              if (inputGrade.current.classList.contains("open"))
                                inputGrade.current.click();
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="result">
            <div className="result-content">
              <h4>GPA Calculator :</h4>
              <span className="result-value">{resultCalc}</span>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <AlertModel
          closeDialog={closeDialog}
          handleDelete={handleDelete}
          todoId={courseId}
          content="Are you sure you want to delete the course name?"
        />
      )}
    </section>
  );
}
/* 
  2*4 + 3 * 2/ 5

  2 and 3: عدد الساعات 
  4 and 2: A+ and C قيمه ال
  5: مجموع عدد ساعات المودا الي دخلها ليا 

  A+ => 4
  A  => 3.667
  B+ => 3.333
  B  => 3
  B- => 2.667
  C+ => 2.333
  C  => 2
  F  => 0
*/
