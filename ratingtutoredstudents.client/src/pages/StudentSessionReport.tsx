// src/pages/StudentSessionReport.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addReportToDB, getStudentsSessionInfo } from "./services/StudentSessionReportService";

// MUI
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

type LearningStyle =
    | "Scaffolding"
    | "SocraticQuestioning"
    | "ActiveRecall"
    | "SpacedRepetition"
    | "Visualization"
    | "WorkedExamples"
    | "PeerTeaching"
    | "ErrorAnalysis"
    | "Gamification"
    | "RealWorldExamples"
    | "Mixed";

const learningStyles: LearningStyle[] = [
    "Scaffolding",
    "SocraticQuestioning",
    "ActiveRecall",
    "SpacedRepetition",
    "Visualization",
    "WorkedExamples",
    "PeerTeaching",
    "ErrorAnalysis",
    "Gamification",
    "RealWorldExamples",
    "Mixed",
];

type Errors = {
    area?: string;
    duration?: string;
    preferredLearningStyle?: string;
};

const StudentSessionReport: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const idNum = Number(id);

    const [studentName, setStudentName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");

    // form state
    const [area, setArea] = useState<string>("");
    const [effectiveness, setEffectiveness] = useState<number>(0);
    const [attitude, setAttitude] = useState<number>(0);
    const [focus, setFocus] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [preferredLearningStyle, setPreferredLearningStyle] = useState<LearningStyle | "">("");
    const [comments, setComments] = useState<string>("");

    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snack, setSnack] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    // fetch name
    useEffect(() => {
        if (!id || Number.isNaN(idNum)) {
            setPageError("Invalid or missing student id.");
            setLoading(false);
            return;
        }

        let alive = true;
        (async () => {
            try {
                // This service is assumed to return a string name
                const name = await getStudentsSessionInfo(idNum);
                if (!alive) return;
                setStudentName(name as unknown as string);
            } catch (e) {
                if (!alive) return;
                setPageError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id, idNum]);

    // validation
    const validate = () => {
        const e: Errors = {};
        if (!area.trim()) e.area = "Area is required.";
        if (duration < 0) e.duration = "Duration must be ≥ 0.";
        if (!preferredLearningStyle) e.preferredLearningStyle = "Please pick a strategy.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // handlers
    const handleStyleChange = (evt: SelectChangeEvent<string>) => {
        setPreferredLearningStyle(evt.target.value as LearningStyle | "");
        setErrors((prev) => ({ ...prev, preferredLearningStyle: undefined }));
    };

    const handleRating =
        (setter: (n: number) => void) =>
            (_: any, value: number | null) => {
                setter(value ?? 0);
            };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setSnack({ type: "err", text: "Please fix the highlighted fields." });
            setSnackOpen(true);
            return;
        }

        try {
            setSubmitting(true);
            // Pass preferredLearningStyle as strategies to the API
            await addReportToDB(
                idNum,
                area,
                effectiveness,
                attitude,
                focus,
                duration,
                preferredLearningStyle || "",
                comments
            );

            setSnack({ type: "ok", text: "Report submitted." });
            setSnackOpen(true);
            setTimeout(() => navigate("/"), 700);
        } catch (err) {
            setSnack({
                type: "err",
                text: err instanceof Error ? err.message : "Failed to submit report.",
            });
            setSnackOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSnackClose = (_e?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
        setSnackOpen(false);
    };

    // page states
    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="center" minHeight="40vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (pageError) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{pageError}</Alert>
                <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
            </Container>
        );
    }

    // UI
    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" mb={2}>
                    <Typography variant="h5">Add Session Report</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Student: {studentName || "—"}
                    </Typography>
                </Stack>

                {submitting && <LinearProgress sx={{ mb: 2 }} />}

                <Box component="form" onSubmit={handleSubmit}>
                    {/* Layout: CSS Grid (no MUI Grid) */}
                    <Box
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        }}
                    >
                        {/* Area */}
                        <TextField
                            label="Area studied"
                            placeholder="For Loops?"
                            value={area}
                            onChange={(e) => {
                                setArea(e.target.value);
                                setErrors((prev) => ({ ...prev, area: undefined }));
                            }}
                            error={!!errors.area}
                            helperText={errors.area}
                            fullWidth
                        />

                        {/* Duration */}
                        <TextField
                            label="Duration (minutes)"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={Number.isFinite(duration) ? duration : ""}
                            onChange={(e) => {
                                const v = e.target.value === "" ? 0 : Number(e.target.value);
                                setDuration(v);
                                setErrors((prev) => ({ ...prev, duration: undefined }));
                            }}
                            error={!!errors.duration}
                            helperText={errors.duration}
                            fullWidth
                        />

                        {/* Preferred Learning Style */}
                        <FormControl fullWidth error={!!errors.preferredLearningStyle} sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                            <InputLabel id="pls-label">Strategy used</InputLabel>
                            <Select
                                labelId="pls-label"
                                label="Strategy used"
                                value={preferredLearningStyle}
                                onChange={handleStyleChange}
                            >
                                <MenuItem value="">Select…</MenuItem>
                                {learningStyles.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {s}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.preferredLearningStyle && (
                                <FormHelperText>{errors.preferredLearningStyle}</FormHelperText>
                            )}
                        </FormControl>

                        {/* Ratings (full width rows) */}
                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <Typography gutterBottom>How effective was the session?</Typography>
                            <Rating
                                name="effectiveness"
                                value={effectiveness}
                                onChange={handleRating(setEffectiveness)}
                            />
                        </Box>

                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <Typography gutterBottom>How was the student’s attitude?</Typography>
                            <Rating
                                name="attitude"
                                value={attitude}
                                onChange={handleRating(setAttitude)}
                            />
                        </Box>

                        <Box sx={{ gridColumn: "1 / -1" }}>
                            <Typography gutterBottom>How focused was the student?</Typography>
                            <Rating
                                name="focus"
                                value={focus}
                                onChange={handleRating(setFocus)}
                            />
                        </Box>

                        {/* Comments */}
                        <TextField
                            label="Extra comments"
                            placeholder="Anything else worth noting…"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            fullWidth
                            multiline
                            minRows={4}
                            sx={{ gridColumn: "1 / -1" }}
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
                            {submitting ? "Submitting..." : "Submit"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Snackbar */}
            {snack && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    key={snack.text}
                >
                    <Alert
                        onClose={handleSnackClose}
                        severity={snack.type === "ok" ? "success" : "error"}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {snack.text}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};

export default StudentSessionReport;