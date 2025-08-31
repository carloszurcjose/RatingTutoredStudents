// src/pages/HomePage.tsx (MUI version)
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Student } from "../types/Student";
import { getStudents } from "./services/HomePageService";

// MUI
import {
    Container, Paper, Typography, TextField, InputAdornment,
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    TableSortLabel, IconButton, Button, Stack, Box, CircularProgress, Alert, Tooltip
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddIcon from "@mui/icons-material/Add";

const HomePage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<keyof Student>("last_name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const navigate = useNavigate();

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const data = await getStudents();
                if (alive) setStudents(data);
            } catch (e) {
                if (alive) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = q
            ? students.filter(s =>
                `${s.first_name} ${s.last_name}`.toLowerCase().includes(q)
            )
            : students;

        const dir = sortDir === "asc" ? 1 : -1;
        return [...base].sort((a, b) => {
            const av = a[sortBy] as unknown;
            const bv = b[sortBy] as unknown;

            if (typeof av === "number" && typeof bv === "number") {
                return (av - bv) * dir;
            }
            const va = String(av ?? "");
            const vb = String(bv ?? "");
            return va.localeCompare(vb, undefined, { numeric: true, sensitivity: "base" }) * dir;
        });
    }, [students, query, sortBy, sortDir]);

    const toggleSort = (key: keyof Student) => {
        if (key === sortBy) setSortDir(d => (d === "asc" ? "desc" : "asc"));
        else {
            setSortBy(key);
            setSortDir("asc");
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box display="flex" alignItems="center" justifyContent="center" minHeight="40vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" mb={2}>
                <Typography variant="h5">Welcome Tutors</Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
                    <TextField
                        id="student-search"
                        placeholder="Search students…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/student/addStudent")}
                    >
                        Add Student
                    </Button>
                </Stack>
            </Stack>

            <Paper elevation={2}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sortDirection={sortBy === "id" ? sortDir : false}>
                                    <TableSortLabel
                                        active={sortBy === "id"}
                                        direction={sortBy === "id" ? sortDir : "asc"}
                                        onClick={() => toggleSort("id")}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={sortBy === "first_name" ? sortDir : false}>
                                    <TableSortLabel
                                        active={sortBy === "first_name"}
                                        direction={sortBy === "first_name" ? sortDir : "asc"}
                                        onClick={() => toggleSort("first_name")}
                                    >
                                        First Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection={sortBy === "last_name" ? sortDir : false}>
                                    <TableSortLabel
                                        active={sortBy === "last_name"}
                                        direction={sortBy === "last_name" ? sortDir : "asc"}
                                        onClick={() => toggleSort("last_name")}
                                    >
                                        Last Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            No students found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((s) => (
                                    <TableRow key={s.id} hover>
                                        <TableCell>{s.id}</TableCell>
                                        <TableCell>{s.first_name}</TableCell>
                                        <TableCell>{s.last_name}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={`View ${s.first_name} ${s.last_name}`}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/student/report/${s.id}`)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={`Add report for ${s.first_name} ${s.last_name}`}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/student/addReport/${s.id}`)}
                                                >
                                                    <NoteAddIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default HomePage;
