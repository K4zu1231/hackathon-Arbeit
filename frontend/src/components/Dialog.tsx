import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogActions, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Link} from 'react-router-dom';

import Timer from './Timer.tsx'

const Subjects = ['国語', '数学', '英語', '理科', '社会'];

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const [subjects, setSubjects] = React.useState('');

    const { onClose, selectedValue, open } = props;

    const handleChange = (event: SelectChangeEvent) => {
        setSubjects(event.target.value as string);
    }

    const handleClose = () => {
        onClose(selectedValue);
    };

    return (

        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>勉強する科目を選んでください</DialogTitle>
            <FormControl>
            <InputLabel id="subjects-label">科目</InputLabel>
            <Select
                labelId="subjects-label"
                id="subjects-select"
                value={subjects}
                label="subjects"
                onChange={handleChange}
                >
                <MenuItem value="kokugo">国語</MenuItem>
                <MenuItem value="sugaku">数学</MenuItem>
                <MenuItem value="eigo">英語</MenuItem>
                <MenuItem value="rika">理科</MenuItem>
                <MenuItem value="shakai">社会</MenuItem>
            </Select>
                <Timer />
                <DialogActions>
                <Button component={Link} to="/study">勉強を始める</Button>
                </DialogActions>
            </FormControl>
        </Dialog>

    );
}

export default function SimpleDialogDemo() {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(Subjects[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>

            <Button variant="contained" onClick={handleClickOpen}>
                勉強する
            </Button>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}
