import { FC, useState } from 'react';
import { IVacancy } from '../../../types/responses';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import EditVacancyModal from '../../common/Modals/EditVacancyModal';
import { handleDeleteVacancy } from '../../../services/api';

type Props = {
  vacancy: IVacancy;
  recruiterId: string | number;
  handleFetchVacancies: () => void;
};

const cardTitleSx = { textAlign: 'left', fontWeight: 600, fontSize: 14 };

const VacancyCard: FC<Props> = ({
  vacancy,
  recruiterId,
  handleFetchVacancies,
}: Props) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  return (
    <>
      <Grid item xs={4}>
        <Card
          sx={{
            border: '2px solid pink',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {vacancy.title}
            </Typography>
            <Typography gutterBottom sx={cardTitleSx}>
              Description
            </Typography>
            <Typography component="p" sx={{ mb: 3 }}>
              {vacancy.description}
            </Typography>
            <Typography gutterBottom sx={cardTitleSx}>
              Requirements
            </Typography>
            <Typography component="div">
              {vacancy.requirements.map((req, index) => (
                <span key={`${vacancy.id}-${req}`}>
                  <span style={{ textTransform: 'capitalize' }}>{req}</span>
                  {index !== vacancy.requirements.length - 1 ? (
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        paddingLeft: '6px',
                        paddingRight: '6px',
                        color: 'gray',
                      }}
                    >
                      |
                    </span>
                  ) : (
                    ''
                  )}
                </span>
              ))}
            </Typography>
          </CardContent>
          <Box
            sx={{
              display: 'flex',
              padding: '0.5rem 1rem',
              gap: '0.5rem',
            }}
          >
            <Button variant="outlined" onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() =>
                handleDeleteVacancy(vacancy.id).then(() =>
                  handleFetchVacancies(),
                )
              }
            >
              Delete
            </Button>
          </Box>
        </Card>
      </Grid>
      {isEditOpen && (
        <EditVacancyModal
          open={isEditOpen}
          setOpen={setIsEditOpen}
          vacancy={vacancy}
          recruiterId={recruiterId}
          handleFetchVacancies={handleFetchVacancies}
        />
      )}
    </>
  );
};

export default VacancyCard;
