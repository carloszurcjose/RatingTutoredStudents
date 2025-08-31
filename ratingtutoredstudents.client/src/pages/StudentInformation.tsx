// src/pages/StudentInformation.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { StudentInformationType } from "../types/StudentInformationType";
import { getStudentsSessionInfo } from "./services/StudentInformationService";

// MUI
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// (optional) icons
import InsightsIcon from "@mui/icons-material/Insights";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PsychologyIcon from "@mui/icons-material/Psychology";

const StudentInformation: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const idNum = Number(id);

    const [studentSessionInfo, setStudentSessionInfo] = useState<StudentInformationType>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        if (!id || Number.isNaN(idNum)) {
            setError("Invalid or missing student id in URL.");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const data = await getStudentsSessionInfo(idNum);
                if (alive) setStudentSessionInfo(data);
            } catch (e) {
                if (alive) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id, idNum]);

    // --- UI states ---
    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="center" minHeight="40vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </Container>
        );
    }

    if (!studentSessionInfo) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No session information found for this student.
                </Alert>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => navigate(`/student/addReport/${idNum}`)}>
                        Add Report
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Stack>
            </Container>
        );
    }

    // Helper: split strategies into chips, tolerate empty string/null-ish
    const strategies =
        (studentSessionInfo.strategies_used || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h5">
                    Student: {studentSessionInfo.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
                    <Button variant="contained" onClick={() => navigate(`/student/addReport/${idNum}`)}>
                        Add Report
                    </Button>
                </Stack>
            </Stack>

            {/* Stats */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Averages
                </Typography>

                {/* CSS Grid for stats (no MUI Grid component) */}
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                    }}
                >
                    <StatCard
                        icon={<InsightsIcon />}
                        label="Effectiveness"
                        value={studentSessionInfo.effectiveness}
                    />
                    <StatCard
                        icon={<PsychologyIcon />}
                        label="Attitude"
                        value={studentSessionInfo.attitude}
                    />
                    <StatCard
                        icon={<EmojiEventsIcon />}
                        label="Focus"
                        value={studentSessionInfo.focus}
                    />
                    <StatCard
                        icon={<ScheduleIcon />}
                        label="Duration"
                        value={studentSessionInfo.duration}
                    />
                </Box>
            </Paper>

            {/* Strategies */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Best Strategies
                </Typography>
                {strategies.length ? (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {strategies.map((s) => (
                            <Chip key={s} label={s} color="primary" variant="outlined" />
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        No strategy data available.
                    </Typography>
                )}
            </Paper>

            {/* Comments */}
            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Extra Comments
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body1">
                    {studentSessionInfo.comments || "No comments recorded."}
                </Typography>
            </Paper>
        </Container>
    );
};

// --- tiny presentational card component ---
function StatCard({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode;
    label: string;
    value: number | string | null | undefined;
}) {
    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                {icon}
                <Typography variant="overline">{label}</Typography>
            </Stack>
            <Typography variant="h6">
                {value ?? "—"}
            </Typography>
        </Paper>
    );
}

export default StudentInformation;
