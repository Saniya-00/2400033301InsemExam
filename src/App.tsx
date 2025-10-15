import React, { useState } from "react";

// ------------------------------
// Interfaces
// ------------------------------
interface Achievement {
  id: number;
  title: string;
  activityType: string;
  studentId: string;
  studentName: string;
  verified: boolean;
}

// ------------------------------
// Main Component
// ------------------------------
export default function App() {
  const [role, setRole] = useState<"student" | "admin">("student");

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [form, setForm] = useState({
    title: "",
    activityType: "",
    studentId: "",
    studentName: "",
  });

  const [notification, setNotification] = useState("");

  // ------------------------------
  // Helpers
  // ------------------------------
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const isAlpha = (str: string) => /^[A-Za-z\s]+$/.test(str);
  const isDigits = (str: string) => /^[0-9]+$/.test(str);

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.activityType || !form.studentId || !form.studentName) {
      showNotification("Please fill in all details!");
      return;
    }

    if (!isAlpha(form.studentName)) {
      showNotification("Student Name must contain only letters!");
      return;
    }

    if (!isDigits(form.studentId)) {
      showNotification("Student ID must contain only digits!");
      return;
    }

    if (!isAlpha(form.activityType)) {
      showNotification("Activity Type must contain only letters!");
      return;
    }

    setAchievements([
      ...achievements,
      {
        id: Date.now(),
        ...form,
        verified: false,
      },
    ]);

    showNotification("Achievement submitted successfully!");
    setForm({ title: "", activityType: "", studentId: "", studentName: "" });
  };

  const handleVerify = (id: number) => {
    setAchievements(
      achievements.map((a) => (a.id === id ? { ...a, verified: true } : a))
    );
    showNotification("Achievement verified!");
  };

  const handleDelete = (id: number) => {
    setAchievements(achievements.filter((a) => a.id !== id));
    showNotification("Achievement deleted!");
  };

  const downloadCSV = () => {
    const headers = ["ID", "Title", "Type", "Student", "Verified"];
    const rows = achievements.map((a) => [
      a.id,
      a.title,
      a.activityType,
      a.studentName,
      a.verified ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "achievements.csv";
    a.click();
    showNotification("CSV exported!");
  };

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="bg-sky-500 text-white py-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">Stutrack Prototype</h1>
          <div>
            <button
              onClick={() => setRole("student")}
              className={`px-3 py-1 rounded-l ${
                role === "student" ? "bg-white text-sky-500" : "bg-sky-300"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`px-3 py-1 rounded-r ${
                role === "admin" ? "bg-white text-sky-500" : "bg-sky-300"
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ---------------- Student Section ---------------- */}
        <section>
          <div className="bg-gray-100 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Student Dashboard</h2>

            {role === "student" && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Activity Type (letters only)"
                  value={form.activityType}
                  onChange={(e) =>
                    setForm({ ...form, activityType: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Student ID (digits only)"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Student Name (letters only)"
                  value={form.studentName}
                  onChange={(e) =>
                    setForm({ ...form, studentName: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 text-white rounded"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        title: "",
                        activityType: "",
                        studentId: "",
                        studentName: "",
                      })
                    }
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}

            {/* Achievements List */}
            <div className="mt-4">
              <h3 className="font-semibold">My Achievements</h3>
              <ul className="mt-2 space-y-2">
                {achievements
                  .filter((a) => a.studentId === form.studentId)
                  .map((a) => (
                    <li
                      key={a.id}
                      className="p-2 border rounded flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-gray-600">
                          {a.activityType} • {a.studentName}
                        </div>
                        <div
                          className={`text-xs ${
                            a.verified ? "text-green-500" : "text-yellow-500"
                          }`}
                        >
                          {a.verified ? "Verified" : "Pending"}
                        </div>
                      </div>
                    </li>
                  ))}
                {achievements.filter((a) => a.studentId === form.studentId).length ===
                  0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    No achievements yet
                  </div>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- Admin Section ---------------- */}
        <aside>
          {role === "admin" && (
            <div className="bg-gray-100 rounded-lg shadow p-4 space-y-4">
              <h3 className="font-semibold">Admin Panel</h3>
              <div className="text-sm text-gray-600">Pending verification</div>

              <div className="mt-3 space-y-2">
                {achievements.filter((a) => !a.verified).map((p) => (
                  <div
                    key={p.id}
                    className="p-2 border rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-gray-600">
                        {p.studentName} • {p.activityType}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(p.id)}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {achievements.filter((a) => !a.verified).length === 0 && (
                  <div className="text-xs text-gray-500">No pending items</div>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Reports</h4>
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    onClick={downloadCSV}
                    className="px-3 py-2 bg-green-500 text-white rounded"
                  >
                    Export All CSV
                  </button>
                  <button
                    onClick={() => showNotification("PDF export demo!")}
                    className="px-3 py-2 bg-indigo-500 text-white rounded"
                  >
                    Export PDF (demo)
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 text-center text-xs text-gray-500">
        Prototype • Designed for demo purposes
      </footer>
    </div>
  );
}
