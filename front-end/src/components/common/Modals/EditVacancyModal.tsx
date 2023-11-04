import { FC, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Modal,
  Container,
  Input,
  TextField,
} from '@mui/material';

import { Sheet, ModalClose } from '@mui/joy';
import { IVacancy } from '../../../types/responses';
import { requestVacancyEdit } from '../../../services/api';

type EditVacancyModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  vacancy: IVacancy;
  recruiterId: string | number;
  handleFetchVacancies: () => void;
};

const EditVacancyModal: FC<EditVacancyModalProps> = ({
  vacancy,
  open,
  setOpen,
  handleFetchVacancies,
}) => {
  const [title, setTitle] = useState(vacancy.title);
  const [description, setDescription] = useState(vacancy.description);
  const [requirements, setRequirements] = useState(vacancy.requirements);

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 600,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <span onClick={() => setOpen(false)}>
          <ModalClose
            variant="outlined"
            sx={{
              top: 'calc(-1/4 * var(--IconButton-size))',
              right: 'calc(-1/4 * var(--IconButton-size))',
              boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
              borderRadius: '50%',
              bgcolor: 'background.body',
            }}
          />
        </span>

        <Typography component="h2" id="modal-title" fontWeight="lg" mb={1}>
          Edit vacancy №{vacancy.id}
        </Typography>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            mt: 2,
          }}
        >
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={vacancy.title}
          />
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={vacancy.description}
          />
          <Box
            component="span"
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <TextField
              value={requirements.join(', ')}
              onChange={(event) =>
                setRequirements(event.target.value.split(', '))
              }
              placeholder={'Requirements'}
              helperText={'Values must be separated by comma'}
              variant="standard"
            />
            <span style={{ opacity: 0.6 }}>
              Current requirements:
              <p style={{ margin: 0 }}>{vacancy.requirements.join(', ')}</p>
            </span>
          </Box>
        </Container>
        <Container
          sx={{
            display: 'flex',
            gap: '1rem',
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              requestVacancyEdit({
                id: vacancy.id,
                title,
                description,
                requirements,
              }).then(() => handleFetchVacancies());

              setOpen(false);
            }}
          >
            Confirm
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </Container>
      </Sheet>
    </Modal>
  );
};

export default EditVacancyModal;
