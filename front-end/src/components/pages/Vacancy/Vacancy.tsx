import {
  Paper,
  Container,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  Grid,
  Card,
  CardContent,
  Typography,
  Input,
  TextField,
  Button,
} from '@mui/material';
import { FC, useState, useEffect } from 'react';
import { IRecruiter, IVacancy } from '../../../types/responses';
import VacancyCard from './VacancyCard';
import {
  requestVacanciesByRecruiterId,
  requestVacancyCreation,
} from '../../../services/api';

type Props = {
  recruiters: IRecruiter[];
};

const Vacancy: FC<Props> = (props) => {
  const { recruiters } = props;
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>('');
  const [vacancies, setVacancies] = useState<IVacancy[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);

  const handleRecruiterChange = (event: SelectChangeEvent) => {
    setSelectedRecruiter(event.target.value as string);
  };

  const handleFetchVacancies = async () => {
    await requestVacanciesByRecruiterId(selectedRecruiter).then((res) =>
      setVacancies(res),
    );
  };

  const handleClearCreateFields = () => {
    setTitle('');
    setDescription('');
    setRequirements([]);
  };

  useEffect(() => {
    if (selectedRecruiter) {
      handleFetchVacancies();
    }
  }, [selectedRecruiter]);

  useEffect(() => {
    handleClearCreateFields();
  }, [vacancies]);

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <Paper>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '1rem 0',
          }}
        >
          <h2>Vacancy List</h2>
          <FormControl
            sx={{
              width: 175,
            }}
          >
            <Select
              onChange={handleRecruiterChange}
              value={selectedRecruiter}
              variant="outlined"
              defaultValue="Select recruiter"
              MenuProps={{
                sx: {
                  maxHeight: 300,
                },
              }}
            >
              {recruiters.length > 0 &&
                recruiters.map((recruiter: IRecruiter) => (
                  <MenuItem
                    key={`recruiter-${recruiter.id}`}
                    value={recruiter.id}
                  >
                    {recruiter.user.firstName} {recruiter.user.lastName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <Paper sx={{ padding: '1rem' }}>
        <Grid container spacing={4}>
          {vacancies.length > 0 && (
            <>
              <Grid item xs={4}>
                <Card
                  sx={{
                    border: '2px solid green',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Create Vacancy
                    </Typography>
                    <Input
                      value={title}
                      placeholder={'Title'}
                      sx={{ width: '100%' }}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <Input
                      value={description}
                      placeholder={'Description'}
                      sx={{ width: '100%' }}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                    <TextField
                      value={requirements.join(', ')}
                      onChange={(event) =>
                        setRequirements(event.target.value.split(', '))
                      }
                      placeholder={'Requirements'}
                      helperText={'Values must be separated by comma'}
                      variant="standard"
                      sx={{ width: '100%', mb: 1.5 }}
                    />
                  </CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      padding: '0 0 0.5rem 1rem',
                      gap: '0.5rem',
                    }}
                  >
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() =>
                        requestVacancyCreation({
                          title,
                          description,
                          requirements,
                          recruiterId: +selectedRecruiter,
                        }).then(() => handleFetchVacancies())
                      }
                    >
                      Create
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleClearCreateFields()}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Card>
              </Grid>
              {vacancies.map((vacancy: IVacancy) => (
                <VacancyCard
                  key={`vacancy-${vacancy.id}`}
                  vacancy={vacancy}
                  recruiterId={selectedRecruiter}
                  handleFetchVacancies={handleFetchVacancies}
                />
              ))}
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Vacancy;
