import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  // Appointments
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  // Doctors
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] =
    useState(true);

  // Doctor form
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialization: "",
    experience: "",
    fee: "",
  });

  const [editingDoctorId, setEditingDoctorId] =
    useState(null);

  const [savingDoctor, setSavingDoctor] =
    useState(false);

  const [doctorError, setDoctorError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  // ==========================================
  // CHECK ADMIN LOGIN
  // ==========================================

  useEffect(() => {
    const storedAdmin =
      localStorage.getItem("admin");

    const loginStatus =
      localStorage.getItem("isAdminLoggedIn");

    if (
      !storedAdmin ||
      loginStatus !== "true"
    ) {
      navigate("/admin-login");
      return;
    }

    try {
      setAdmin(JSON.parse(storedAdmin));
    } catch (error) {
      localStorage.removeItem("admin");
      localStorage.removeItem(
        "isAdminLoggedIn"
      );

      navigate("/admin-login");
      return;
    }

    loadAppointments();
    loadDoctors();
  }, [navigate]);

  // ==========================================
  // GET APPOINTMENTS
  // ==========================================

  const loadAppointments = async () => {
    setLoadingAppointments(true);

    try {
      const response = await fetch(
        `${API}/appointments/get.php`
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid JSON from appointments API"
        );
      }

      if (data.success) {
        setAppointments(
          data.appointments || []
        );
      } else {
        alert(
          data.message ||
            "Unable to load appointments"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to PHP server."
      );
    } finally {
      setLoadingAppointments(false);
    }
  };

  // ==========================================
  // GET DOCTORS
  // ==========================================

  const loadDoctors = async () => {
    setLoadingDoctors(true);

    try {
      const response = await fetch(
        `${API}/doctors/get.php`
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid JSON from doctors API"
        );
      }

      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        setDoctorError(
          data.message ||
            "Unable to load doctors"
        );
      }
    } catch (error) {
      console.error(
        "Load doctors error:",
        error
      );

      setDoctorError(
        "Cannot connect to PHP server."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  // ==========================================
  // DOCTOR FORM CHANGE
  // ==========================================

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;

    setDoctorForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setDoctorError("");
  };

  // ==========================================
  // ADD / UPDATE DOCTOR
  // ==========================================

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();

    setDoctorError("");

    if (!doctorForm.name.trim()) {
      setDoctorError(
        "Please enter doctor name."
      );
      return;
    }

    if (!doctorForm.specialization.trim()) {
      setDoctorError(
        "Please enter specialization."
      );
      return;
    }

    if (
      doctorForm.experience === "" ||
      Number(doctorForm.experience) < 0
    ) {
      setDoctorError(
        "Please enter valid experience."
      );
      return;
    }

    if (
      doctorForm.fee === "" ||
      Number(doctorForm.fee) < 0
    ) {
      setDoctorError(
        "Please enter valid consultation fee."
      );
      return;
    }

    setSavingDoctor(true);

    try {
      const endpoint = editingDoctorId
        ? `${API}/doctors/update.php`
        : `${API}/doctors/add.php`;

      const body = editingDoctorId
        ? {
            id: editingDoctorId,
            name: doctorForm.name.trim(),
            specialization:
              doctorForm.specialization.trim(),
            experience: Number(
              doctorForm.experience
            ),
            fee: Number(doctorForm.fee),
          }
        : {
            name: doctorForm.name.trim(),
            specialization:
              doctorForm.specialization.trim(),
            experience: Number(
              doctorForm.experience
            ),
            fee: Number(doctorForm.fee),
          };

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const text = await response.text();

      console.log(
        "Doctor API response:",
        text
      );

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "PHP returned invalid JSON."
        );
      }

      if (data.success) {
        alert(
          editingDoctorId
            ? "Doctor updated successfully."
            : "Doctor added successfully."
        );

        resetDoctorForm();

        loadDoctors();
      } else {
        setDoctorError(
          data.message ||
            "Unable to save doctor."
        );
      }
    } catch (error) {
      console.error(
        "Doctor save error:",
        error
      );

      setDoctorError(
        "Cannot connect to PHP server."
      );
    } finally {
      setSavingDoctor(false);
    }
  };

  // ==========================================
  // EDIT DOCTOR
  // ==========================================

  const handleEditDoctor = (doctor) => {
    setEditingDoctorId(
      doctor.id
    );

    setDoctorForm({
      name: doctor.name || "",
      specialization:
        doctor.specialization || "",
      experience:
        doctor.experience ?? "",
      fee:
        doctor.fee ?? "",
    });

    setDoctorError("");

    // Scroll to form
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetDoctorForm = () => {
    setDoctorForm({
      name: "",
      specialization: "",
      experience: "",
      fee: "",
    });

    setEditingDoctorId(null);
    setDoctorError("");
  };

  // ==========================================
  // DELETE DOCTOR
  // ==========================================

  const handleDeleteDoctor = async (
    doctorId,
    doctorName
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${doctorName}?`
    );

    if (!confirmed) {
      return;
    }

    setUpdatingId(doctorId);

    try {
      const response = await fetch(
        `${API}/doctors/delete.php`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id: doctorId,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid JSON from delete API"
        );
      }

      if (data.success) {
        setDoctors((previous) =>
          previous.filter(
            (doctor) =>
              Number(doctor.id) !==
              Number(doctorId)
          )
        );

        alert(
          "Doctor deleted successfully."
        );
      } else {
        alert(
          data.message ||
            "Unable to delete doctor."
        );
      }
    } catch (error) {
      console.error(
        "Delete doctor error:",
        error
      );

      alert(
        "Cannot connect to PHP server."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // CHANGE DOCTOR STATUS
  // ==========================================

  const handleDoctorStatus = async (
    doctor
  ) => {
    const newStatus =
      doctor.status === "Active"
        ? "Inactive"
        : "Active";

    setUpdatingId(doctor.id);

    try {
      const response = await fetch(
        `${API}/doctors/status.php`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id: doctor.id,
            status: newStatus,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid JSON from status API"
        );
      }

      if (data.success) {
        setDoctors((previous) =>
          previous.map((item) =>
            Number(item.id) ===
            Number(doctor.id)
              ? {
                  ...item,
                  status: newStatus,
                }
              : item
          )
        );
      } else {
        alert(
          data.message ||
            "Unable to update doctor status."
        );
      }
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Cannot connect to PHP server."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // UPDATE APPOINTMENT STATUS
  // ==========================================

  const updateAppointmentStatus = async (
    id,
    status
  ) => {
    setUpdatingId(id);

    try {
      const response = await fetch(
        `${API}/appointments/update_status.php`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

      const text = await response.text();

      const data = JSON.parse(text);

      if (data.success) {
        setAppointments((previous) =>
          previous.map((item) =>
            Number(item.id) === Number(id)
              ? {
                  ...item,
                  status,
                }
              : item
          )
        );
      } else {
        alert(
          data.message ||
            "Unable to update appointment."
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to PHP server."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("admin");

    localStorage.removeItem(
      "isAdminLoggedIn"
    );

    navigate("/admin-login");
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const pendingCount =
    appointments.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const approvedCount =
    appointments.filter(
      (item) =>
        item.status === "Approved"
    ).length;

  const completedCount =
    appointments.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  const activeDoctors =
    doctors.filter(
      (doctor) =>
        doctor.status === "Active"
    ).length;

  return (
    <main className="admin-dashboard">


      <section className="admin-dashboard-header">

        <div className="dashboard-heading">

          <span className="admin-dashboard-label">
            CAREPLUS ADMIN PANEL
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage doctors and patient
            appointments.
          </p>

        </div>

        <div className="admin-header-actions">

          {admin && (
            <div className="admin-user-info">

              <div className="admin-avatar">
                🛡️
              </div>

              <div>
                <strong>
                  {admin.username}
                </strong>

                <span>
                  Administrator
                </span>
              </div>

            </div>
          )}

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </section>

    {/* STATISTICS */}
      

      <section className="admin-stats">

        <div className="admin-stat-card">

          <div className="stat-icon">
            📅
          </div>

          <div>
            <span>
              Total Appointments
            </span>

            <strong>
              {appointments.length}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="stat-icon pending-icon">
            ⏳
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="stat-icon approved-icon">
            ✓
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              {approvedCount}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="stat-icon completed-icon">
            👨‍⚕️
          </div>

          <div>
            <span>
              Active Doctors
            </span>

            <strong>
              {activeDoctors}
            </strong>
          </div>

        </div>

      </section>


      {/* =====================================
          APPOINTMENT MANAGEMENT
      ===================================== */}

      <section className="admin-appointment-section">

        <div className="admin-section-header">

          <div>
            <span className="section-label">
              APPOINTMENT MANAGEMENT
            </span>

            <h2>
              Patient Appointments
            </h2>

            <p>
              Review and manage patient
              booking requests.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={loadAppointments}
          >
            ↻ Refresh
          </button>

        </div>


        {loadingAppointments ? (

          <div className="dashboard-loading">
            <div className="dashboard-spinner"></div>
            <p>
              Loading appointments...
            </p>
          </div>

        ) : appointments.length === 0 ? (

          <div className="empty-appointments">

            <div className="empty-icon">
              📅
            </div>

            <h3>
              No Appointments
            </h3>

            <p>
              There are currently no
              patient appointments.
            </p>

          </div>

        ) : (

          <div className="appointment-table-container">

            <table className="appointment-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {appointments.map(
                  (appointment) => (

                    <tr
                      key={appointment.id}
                    >

                      <td>
                        <span className="appointment-id">
                          #{appointment.id}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {
                            appointment.patient_name ||
                            "-"
                          }
                        </strong>
                      </td>

                      <td>
                        <span className="email-text">
                          {
                            appointment.patient_email ||
                            "-"
                          }
                        </span>
                      </td>

                      <td>
                        <strong>
                          {
                            appointment.doctor_name ||
                            "-"
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          appointment.specialization ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          appointment.appointment_date ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          appointment.appointment_time ||
                          "-"
                        }
                      </td>

                      <td>

                        <span
                          className={
                            "status-badge " +
                            String(
                              appointment.status ||
                                ""
                            ).toLowerCase()
                          }
                        >
                          {
                            appointment.status
                          }
                        </span>

                      </td>

                      <td>

                        <select
                          className="status-select"
                          value={
                            appointment.status
                          }
                          disabled={
                            updatingId ===
                            appointment.id
                          }
                          onChange={(e) =>
                            updateAppointmentStatus(
                              appointment.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Approved">
                            Approved
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                          <option value="Completed">
                            Completed
                          </option>

                        </select>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>


      {/* =====================================
          DOCTOR MANAGEMENT
      ===================================== */}

      <section className="doctor-management-section">

        <div className="doctor-management-header">

          <div>

            <span className="section-label">
              DOCTOR MANAGEMENT
            </span>

            <h2>
              Manage Doctors
            </h2>

            <p>
              Add, edit, activate, deactivate
              or delete doctors.
            </p>

          </div>

          <button
            className="refresh-btn"
            onClick={loadDoctors}
            disabled={loadingDoctors}
          >
            ↻{" "}
            {loadingDoctors
              ? "Loading..."
              : "Refresh Doctors"}
          </button>

        </div>


        {/* =================================
            ADD / EDIT DOCTOR FORM
        ================================= */}

        <div className="doctor-form-card">

          <div className="doctor-form-heading">

            <div className="doctor-form-icon">
              {editingDoctorId
                ? "✏️"
                : "➕"}
            </div>

            <div>

              <h3>
                {editingDoctorId
                  ? "Edit Doctor"
                  : "Add New Doctor"}
              </h3>

              <p>
                {editingDoctorId
                  ? "Update doctor information."
                  : "Enter doctor information to add a new doctor."}
              </p>

            </div>

          </div>


          {doctorError && (
            <div className="doctor-form-error">
              ⚠️ {doctorError}
            </div>
          )}


          <form
            className="doctor-form"
            onSubmit={handleDoctorSubmit}
          >

            <div className="doctor-field">

              <label>
                Doctor Name
              </label>

              <input
                type="text"
                name="name"
                value={doctorForm.name}
                onChange={handleDoctorChange}
                placeholder="e.g. Dr. Rahul Sharma"
              />

            </div>


            <div className="doctor-field">

              <label>
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                value={
                  doctorForm.specialization
                }
                onChange={handleDoctorChange}
                placeholder="e.g. Cardiologist"
              />

            </div>


            <div className="doctor-field">

              <label>
                Experience
              </label>

              <input
                type="number"
                name="experience"
                min="0"
                value={
                  doctorForm.experience
                }
                onChange={handleDoctorChange}
                placeholder="Years"
              />

            </div>


            <div className="doctor-field">

              <label>
                Consultation Fee
              </label>

              <input
                type="number"
                name="fee"
                min="0"
                value={doctorForm.fee}
                onChange={handleDoctorChange}
                placeholder="₹ Fee"
              />

            </div>


            <div className="doctor-form-actions">

              <button
                type="submit"
                className="save-doctor-btn"
                disabled={savingDoctor}
              >
                {savingDoctor
                  ? "Saving..."
                  : editingDoctorId
                  ? "Update Doctor"
                  : "Add Doctor"}
              </button>


              {editingDoctorId && (
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={resetDoctorForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>


        {/* =================================
            DOCTOR LIST
        ================================= */}

        <div className="doctor-list-container">

          <div className="doctor-list-heading">

            <div>
              <h3>
                All Doctors
              </h3>

              <span>
                {doctors.length} doctors
              </span>
            </div>

            <span className="active-doctor-count">
              {activeDoctors} Active
            </span>

          </div>


          {loadingDoctors ? (

            <div className="doctor-loading">

              <div className="dashboard-spinner"></div>

              <p>
                Loading doctors...
              </p>

            </div>

          ) : doctors.length === 0 ? (

            <div className="doctor-empty">

              <div>
                👨‍⚕️
              </div>

              <h3>
                No Doctors Found
              </h3>

              <p>
                Add your first doctor using
                the form above.
              </p>

            </div>

          ) : (

            <div className="admin-doctor-grid">

              {doctors.map((doctor) => (

                <div
                  className="admin-doctor-card"
                  key={doctor.id}
                >

                  <div className="admin-doctor-top">

                    <div className="admin-doctor-avatar">
                      👨‍⚕️
                    </div>

                    <span
                      className={
                        doctor.status ===
                        "Active"
                          ? "doctor-status active"
                          : "doctor-status inactive"
                      }
                    >
                      ●{" "}
                      {doctor.status}
                    </span>

                  </div>


                  <div className="admin-doctor-info">

                    <h3>
                      {doctor.name}
                    </h3>

                    <p className="admin-doctor-specialization">
                      {doctor.specialization}
                    </p>


                    <div className="admin-doctor-details">

                      <div>
                        <span>
                          Experience
                        </span>

                        <strong>
                          {
                            doctor.experience
                          }{" "}
                          years
                        </strong>
                      </div>

                      <div>
                        <span>
                          Consultation
                        </span>

                        <strong>
                          ₹
                          {
                            doctor.fee
                          }
                        </strong>
                      </div>

                    </div>

                  </div>


                  <div className="admin-doctor-actions">

                    <button
                      className="edit-doctor-btn"
                      onClick={() =>
                        handleEditDoctor(
                          doctor
                        )
                      }
                      disabled={
                        updatingId ===
                        doctor.id
                      }
                    >
                      ✏️ Edit
                    </button>


                    <button
                      className={
                        doctor.status ===
                        "Active"
                          ? "deactivate-doctor-btn"
                          : "activate-doctor-btn"
                      }
                      onClick={() =>
                        handleDoctorStatus(
                          doctor
                        )
                      }
                      disabled={
                        updatingId ===
                        doctor.id
                      }
                    >
                      {doctor.status ===
                      "Active"
                        ? "🔴 Deactivate"
                        : "🟢 Activate"}
                    </button>


                    <button
                      className="delete-doctor-btn"
                      onClick={() =>
                        handleDeleteDoctor(
                          doctor.id,
                          doctor.name
                        )
                      }
                      disabled={
                        updatingId ===
                        doctor.id
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default AdminDashboard;