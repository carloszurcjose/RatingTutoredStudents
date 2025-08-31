// src/pages/AddStudent.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewStudentType } from "../types/NewStudentType";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import FormHelperText from "@mui/material/FormHelperText";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const classifications = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"];
const learningStyles = [
    "Scaffolding", "SocraticQuestioning", "ActiveRecall", "SpacedRepetition",
    "Visualization", "WorkedExamples", "PeerTeaching", "ErrorAnalysis",
    "Gamification", "RealWorldExamples", "Mixed"
];

type Errors = Partial<Record<keyof NewStudentType, string>>;

export default function AddStudent() {
    const navigate = useNavigate();

    const [form, setForm] = useState<NewStudentType>({
        first_name: "",
        last_name: "",
        age: null,
        classification: "",
        major: "",
        gpa: null,
        motivation: 5,
        preferred_learning_style: "",
        past_strategy_effectiveness: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
    const [snackOpen, setSnackOpen] = useState(false);

    const toNumber = (v: string) => (v === "" ? null : Number(v));

    const validate = (f = form): Errors => {
        const e: Errors = {};
        if (!f.first_name.trim()) e.first_name = "First name is required.";
        if (!f.last_name.trim()) e.last_name = "Last name is required.";
        if (f.age == null) e.age = "Age is required.";
        else if (f.age < 3 || f.age > 120) e.age = "Age must be 3–120.";
        if (!f.classification) e.classification = "Classification is required.";
        if (!f.major.trim()) e.major = "Major is required.";
        if (f.gpa == null) e.gpa = "GPA is required.";
        else if (f.gpa < 0 || f.gpa > 4) e.gpa = "GPA must be 0.0–4.0.";
        if (f.motivation == null || f.motivation < 0 || f.motivation > 10)
            e.motivation = "Motivation must be 0–10.";
        if (!f.preferred_learning_style) e.preferred_learning_style = "Preferred learning style is required.";
        if (!f.past_strategy_effectiveness.trim())
            e.past_strategy_effectiveness = "Please add a short note.";
        return e;
    };

    // handlers
    const onText =
        (key: "first_name" | "last_name" | "major" | "past_strategy_effectiveness") =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((f) => ({ ...f, [key]: e.target.value }));
                setErrors((prev) => ({ ...prev, [key]: undefined }));
            };

    const onNumber =
        (key: "age" | "gpa") =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((f) => ({ ...f, [key]: toNumber(e.target.value) }));
                setErrors((prev) => ({ ...prev, [key]: undefined }));
            };

    const onSelect =
        (key: "classification" | "preferred_learning_style") =>
            (e: SelectChangeEvent<string>) => {
                setForm((f) => ({ ...f, [key]: e.target.value }));
                setErrors((prev) => ({ ...prev, [key]: undefined }));
            };

    const onMotivation = (_: Event, value: number | number[]) => {
        setForm((f) => ({ ...f, motivation: Array.isArray(value) ? value[0] : value }));
        setErrors((prev) => ({ ...prev, motivation: undefined }));
    };

    const handleSnackClose = (_evt?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const eMap = validate();
        setErrors(eMap);
        setMsg(null);

        if (Object.keys(eMap).length) {
            setMsg({ type: "err", text: "Please fix the highlighted fields." });
            setSnackOpen(true);
            return;
        }

        try {
            setSubmitting(true);
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
            setSnackOpen(true);
            setTimeout(() => navigate("/"), 800);
        } catch (err) {
            setMsg({ type: "err", text: err instanceof Error ? err.message : "Unexpected error" });
            setSnackOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Box component="form" onSubmit={onSubmit}>
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h5" mb={2}>Add Student</Typography>
                    {submitting && <LinearProgress sx={{ mb: 2 }} />}

                    {/* CSS Grid via Box — no MUI Grid component */}
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        }}
                    >
                        <TextField
                            label="First Name"
                            value={form.first_name}
                            onChange={onText("first_name")}
                            fullWidth
                            required
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                            disabled={submitting}
                        />

                        <TextField
                            label="Last Name"
                            value={form.last_name}
                            onChange={onText("last_name")}
                            fullWidth
                            required
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                            disabled={submitting}
                        />

                        <TextField
                            label="Age"
                            type="number"
                            value={form.age ?? ""}
                            onChange={onNumber("age")}
                            fullWidth
                            inputProps={{ min: 3, max: 120 }}
                            error={!!errors.age}
                            helperText={errors.age}
                            disabled={submitting}
                        />

                        <FormControl fullWidth error={!!errors.classification} disabled={submitting}>
                            <InputLabel id="classification-label">Classification</InputLabel>
                            <Select
                                labelId="classification-label"
                                label="Classification"
                                value={form.classification}
                                onChange={onSelect("classification")}
                            >
                                {classifications.map((c) => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </Select>
                            {errors.classification && <FormHelperText>{errors.classification}</FormHelperText>}
                        </FormControl>

                        <TextField
                            label="Major"
                            value={form.major}
                            onChange={onText("major")}
                            fullWidth
                            required
                            error={!!errors.major}
                            helperText={errors.major}
                            disabled={submitting}
                            sx={{ gridColumn: { xs: "1", md: "1 / -1" } }} // full width on md+
                        />

                        <TextField
                            label="GPA"
                            type="number"
                            value={form.gpa ?? ""}
                            onChange={onNumber("gpa")}
                            fullWidth
                            inputProps={{ min: 0, max: 4, step: 0.01 }}
                            error={!!errors.gpa}
                            helperText={errors.gpa}
                            disabled={submitting}
                        />

                        <FormControl fullWidth error={!!errors.preferred_learning_style} disabled={submitting}>
                            <InputLabel id="pls-label">Preferred learning style</InputLabel>
                            <Select
                                labelId="pls-label"
                                label="Preferred learning style"
                                value={form.preferred_learning_style}
                                onChange={onSelect("preferred_learning_style")}
                            >
                                {learningStyles.map((s) => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </Select>
                            {errors.preferred_learning_style && (
                                <FormHelperText>{errors.preferred_learning_style}</FormHelperText>
                            )}
                        </FormControl>

                        {/* Motivation slider spans full width */}
                        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
                            <Typography gutterBottom>Motivation (0–10)</Typography>
                            <Slider
                                value={form.motivation ?? 0}
                                onChange={onMotivation}
                                step={1}
                                min={0}
                                max={10}
                                valueLabelDisplay="auto"
                                disabled={submitting}
                            />
                            {errors.motivation && <FormHelperText error>{errors.motivation}</FormHelperText>}
                        </Box>

                        <TextField
                            label="Past strategy effectiveness (notes)"
                            value={form.past_strategy_effectiveness}
                            onChange={onText("past_strategy_effectiveness")}
                            fullWidth
                            multiline
                            minRows={4}
                            error={!!errors.past_strategy_effectiveness}
                            helperText={errors.past_strategy_effectiveness}
                            disabled={submitting}
                            sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                        />
                    </Box>

                    <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Saving…" : "Save"}
                        </Button>
                    </Stack>
                </Paper>
            </Box>

            {msg && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    key={msg.text}
                >
                    <Alert
                        onClose={handleSnackClose}
                        severity={msg.type === "ok" ? "success" : "error"}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {msg.text}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
}
