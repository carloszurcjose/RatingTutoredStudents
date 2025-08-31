// src/pages/AddStudent.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewStudentType } from "../types/NewStudentType"


const AddStudent: React.FC = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<NewStudentType>({
        first_name: "",
        last_name: "",
        age: null,
        classification: "",
        major: "",
        gpa: null,
        motivation: null,
        preferred_learning_style: "",
        past_strategy_effectiveness: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const toNumber = (v: string) => (v === "" ? null : Number(v));

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "age" || name === "gpa" || name === "motivation") {
            setForm((f) => ({ ...f, [name]: toNumber(value) }));
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
    };

    const validate = () => {
        const errors: string[] = [];
        if (form.age == null || form.age < 3 || form.age > 120) errors.push("Age must be 3–120.");
        if (!form.classification) errors.push("Classification is required.");
        if (!form.major) errors.push("Major is required.");
        if (form.gpa == null || form.gpa < 0 || form.gpa > 4) errors.push("GPA must be 0.0–4.0.");
        if (form.motivation == null || form.motivation < 0 || form.motivation > 10)
            errors.push("Motivation must be 0–10.");
        if (!form.preferred_learning_style) errors.push("Preferred learning style is required.");
        if (!form.past_strategy_effectiveness) errors.push("Past strategy effectiveness is required.");
        return errors;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        const errors = validate();
        if (errors.length) {
            setMsg({ type: "err", text: errors.join(" ") });
            return;
        }

        try {
            setSubmitting(true);

            // 🔧 Change this URL to match your API endpoint if different
            // You mentioned your backend runs at https://localhost:7137/
            const res = await fetch("https://localhost:7137/addstudent/newstudent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(txt || `Request failed (${res.status})`);
            }

            setMsg({ type: "ok", text: "Student added successfully." });
            // Optional: navigate back to list after a moment
            setTimeout(() => navigate("/"), 800);
        } catch (err) {
            setMsg({
                type: "err",
                text: err instanceof Error ? err.message : "Unexpected error",
            });
        } finally {
            setSubmitting(false);
        }
    }
    

    return (
        <div style={{ maxWidth: 640, margin: "24px auto", padding: 16 }}>
            <h1 style={{ marginBottom: 16 }}>Add Student</h1>

            {msg && (
                <div
                    style={{
                        marginBottom: 12,
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: msg.type === "ok" ? "#e6ffed" : "#ffeaea",
                        color: msg.type === "ok" ? "#065f46" : "#991b1b",
                        border: `1px solid ${msg.type === "ok" ? "#34d399" : "#f87171"}`,
                    }}
                >
                    {msg.text}
                </div>
            )}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                {/* firstName */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>First Name</span>
                    <input
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={onChange}
                        placeholder="Bob"
                    />
                </label>
                {/* lastName */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Last Name</span>
                    <input
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={onChange}
                        placeholder="Smith"
                    />
                </label>
                {/* Age */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Age (int)</span>
                    <input
                        type="number"
                        name="age"
                        min={3}
                        max={120}
                        value={form.age ?? ""}
                        onChange={onChange}
                        placeholder="e.g., 19"
                    />
                </label>

                {/* Classification */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Classification (varchar)</span>
                    <select
                        name="classification"
                        value={form.classification}
                        onChange={onChange}
                    >
                        <option value="">Select…</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                {/* Major */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Major (varchar)</span>
                    <input
                        type="text"
                        name="major"
                        value={form.major}
                        onChange={onChange}
                        placeholder="e.g., Computer Science"
                    />
                </label>

                {/* GPA */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>GPA (float)</span>
                    <input
                        type="number"
                        name="gpa"
                        step="0.01"
                        min={0}
                        max={4}
                        value={form.gpa ?? ""}
                        onChange={onChange}
                        placeholder="e.g., 3.72"
                    />
                </label>

                {/* Motivation */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Motivation (0–10, int)</span>
                    <input
                        type="number"
                        name="motivation"
                        min={0}
                        max={10}
                        value={form.motivation ?? ""}
                        onChange={onChange}
                        placeholder="e.g., 7"
                    />
                </label>

                {/* Preferred Learning Style */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Preferred learning style (varchar)</span>
                    <select
                        name="preferred_learning_style"
                        value={form.preferred_learning_style}
                        onChange={onChange}
                    >
                        <option value="">Select…</option>
                        <option value="Scaffolding">Scaffolding</option>
                        <option value="SocraticQuestioning">Socratic Questioning</option>
                        <option value="ActiveRecall">Active Recall</option>
                        <option value="SpacedRepetition">Spaced Repitition</option>
                        <option value="Visualization">Visualization</option>
                        <option value="WorkedExamples">Worked Examples </option>
                        <option value="PeerTeaching">Peer Teaching</option>
                        <option value="ErrorAnalysis">Error Analysis</option>
                        <option value="Gamification">Gamification</option>
                        <option value="RealWorldExamples">Real World Examples</option>
                        <option value="Mixed">Mixed</option>
                    </select>
                </label>

                {/* Past Strategy Effectiveness */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Past strategy effectiveness (varchar / short notes)</span>
                    <textarea
                        name="past_strategy_effectiveness"
                        value={form.past_strategy_effectiveness}
                        onChange={onChange}
                        placeholder="e.g., Gamification worked well; Socratic questioning was less effective."
                        rows={4}
                    />
                </label>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Saving…" : "Submit"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} disabled={submitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
