import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Loader from 'src/components/Loader';
import {
  Avatar,
  Autocomplete,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  MenuItem,
  AvatarGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  TextField,
  Button,
  Typography,
  Dialog,
  FormControl,
  Select,
  InputLabel,
  Zoom,
  CardMedia,
  lighten,
  styled
} from '@mui/material';
import Link from 'src/components/Link';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import { fileUploadApi } from 'src/api/fileUpload';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import Text from 'src/components/Text';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const CardWrapper = styled(Card)(
  ({ theme }) => `

  position: relative;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    z-index: 1;
    transition: ${theme.transitions.create(['box-shadow'])};
  }
      
    &.Mui-selected::after {
      box-shadow: 0 0 0 3px ${theme.colors.primary.main};
    }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};
     padding: ${theme.spacing(0.75)};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
     }
`
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getProjectStatusLabel = (projectStatus) => {
  const map = {
    completed: {
      text: 'Completed',
      color: 'success'
    }
  };

  const { text, color } = map[projectStatus];

  return <Label color={color}>{text}</Label>;
};



const applyFilters = (projects, filters) => {
  return projects.filter((project) => {
    let matches = true;

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && value.length >0 && !value.includes(project[key]) ) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (projects, page, limit) => {
  return projects.slice(page * limit, page * limit + limit);
};

const Results = ({ projects }) => {
  const [selectedItems, setSelectedProjects] = useState([]);
  const [projectDelete, setProjectDelete] = useState([]);
  const [projectEdit, setProjectEdit] = useState({});
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false); 
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    store_id: null
  });

 console.log(selectedItems)
  const handleStoreChange = (e,value)=>{
    setFilters((prevFilters) => ({
      ...prevFilters,
      store_id: value
    }));
  }

  const handleProductChange = (e,value)=>{
    setFilters((prevFilters) => ({
      ...prevFilters,
      product_name: value
    }));
  }

  let store = projects.map(item => item.store_id);
  let products = projects.map(item => item.product_name);
  store = new Set(store)
  products = new Set(products)
  store = [...store]
  products = [...products]


  const storeTags = store
  const productTags = products

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'not_started',
      name: t('Not started')
    },
    {
      id: 'completed',
      name: t('Completed')
    },
    {
      id: 'in_progress',
      name: t('In Progress')
    }
  ];

  const handleNameEdit = (event)=>{
    const product_name = event.target.value
    setProjectEdit({...projectEdit , product_name})
  }

  const handlePriceEdit = (event)=>{
    const price = event.target.value
    setProjectEdit({...projectEdit , price})
  }

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      store_id: value
    }));
  };

  const handleSelectAllProjects = (event) => {
    setSelectedProjects(
      event.target.checked ? projects.map((project) => project.id) : []
    );
  };

  const handleSelectOneProject = (_event, projectId) => {
    if (!selectedItems.includes(projectId)) {
      setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedProjects((prevSelected) =>
        prevSelected.filter((id) => id !== projectId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProjects = applyFilters(projects, filters);
  const paginatedProjects = applyPagination(filteredProjects, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeProjects =
    selectedItems.length > 0 && selectedItems.length < projects.length;
  const selectedAllProjects = selectedItems.length === projects.length;

  const [toggleView, setToggleView] = useState('table_view');


  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); 
  const [openProductEdit, setOpenProductEdit] = useState(false); 
 
  const handleProductEdit = (product)=>{
       setProjectEdit(product)
       setOpenProductEdit(true)
  }
  const handleConfirmDelete = (id) => {
    setProjectDelete(id)
    setOpenConfirmDelete(true);
  };

  const closeProductEdit = () => {
    setProjectEdit({})
    setOpenProductEdit(false);
  };


  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setProjectDelete([])
  };

  const handleEditCompleted = async ()=>{
    setOpenProductEdit(false);
    setLoader(true)
    await fileUploadApi.editProduct(projectEdit)
    setLoader(false)
    setProjectEdit({})
    enqueueSnackbar(t('Record Edited successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    window.location.reload();
  }

  const handleDeleteCompleted = async() => {
    setOpenConfirmDelete(false);
    setLoader(true)
    await fileUploadApi.deleteProduct(projectDelete)
    setLoader(false)
    setProjectDelete([])
    enqueueSnackbar(t('The projects has been deleted successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    window.location.reload();
  };

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        {loader?<Loader />:null}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
          <Box p={1}>
              <Autocomplete
                multiple
                sx={{
                  m: 0
                }}
                limitTags={2}
                onChange={handleStoreChange}
                getOptionLabel={(option) => option}
                options={storeTags}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label={t('Store')}
                    placeholder={t('Select stores...')}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
          <Box p={1}>
              <Autocomplete
                multiple
                sx={{
                  m: 0
                }}
                limitTags={2}
                onChange={handleProductChange}
                getOptionLabel={(option) => option}
                options={productTags}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    label={t('Product')}
                    placeholder={t('Select stores...')}
                  />
                )}
              />
            </Box>         
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            display="flex"
            justifyContent={{ xs: 'center', md: 'flex-end' }}
          >
          </Grid>
        </Grid>
      </Card>

      {toggleView === 'table_view' && (
        <Card>
          {selectedBulkActions && (
            <Box p={2}>
              <BulkActions projects={selectedItems} setLoader ={setLoader} />
            </Box>
          )}
          {!selectedBulkActions && (
            <Box
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography component="span" variant="subtitle1">
                  {t('Showing')}:
                </Typography>{' '}
                <b>{paginatedProjects.length}</b> <b>{t('projects')}</b>
              </Box>
              <TablePagination
                component="div"
                count={filteredProjects.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          )}
          <Divider />

          {paginatedProjects.length === 0 ? (
            <>
              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                {t(
                  "We couldn't find any projects matching your search criteria"
                )}
              </Typography>
            </>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAllProjects}
                          indeterminate={selectedSomeProjects}
                          onChange={handleSelectAllProjects}
                        />
                      </TableCell>
                      <TableCell>{t('Store Id')}</TableCell>
                      <TableCell>{t('SKU')}</TableCell>
                      <TableCell>{t('Product Name')}</TableCell>
                      <TableCell>{t('Price')}</TableCell>
                      <TableCell>{t('Date')}</TableCell>
                      <TableCell>{t('Status')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProjects.map((project) => {
                      const isProjectSelected = selectedItems.includes(
                        project.id
                      );
                      return (
                        <TableRow
                          hover
                          key={project.id}
                          selected={isProjectSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isProjectSelected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isProjectSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {project.store_id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {project.sku}
                            </Typography>
                          </TableCell>
                          <TableCell>
                          <Typography noWrap variant="h5">
                              {project.product_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                          <Typography noWrap variant="h5">
                              {project.price}
                            </Typography>
                          </TableCell>
                          <TableCell>
                          <Typography noWrap variant="h5">
                          {format(new Date(project.Date), 'MMMM dd yyyy')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap>
                              {getProjectStatusLabel("completed")}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('View')} arrow>
                                <IconButton 
                                  onClick={()=>{handleProductEdit(project)}}
                                  color="primary">
                                  <LaunchTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={()=>{handleConfirmDelete([project.id])}}
                                  color="primary"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box p={2}>
                <TablePagination
                  component="div"
                  count={filteredProjects.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box>
            </>
          )}
        </Card>
      )}
      
       

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this project')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
      <DialogWrapper
        open={openProductEdit}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeProductEdit}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
           <AvatarPrimary>
            <EditIcon />
          </AvatarPrimary>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Want to edit details ')}?
          </Typography>

          <TextField
          fullWidth
          label="product name"
          required
          name="product"
          autoFocus
          value={projectEdit.product_name}
          onChange={handleNameEdit}
          sx={{mb:4}}
          InputLabelProps={{ shrink: true }}
          
        />
        <TextField
          fullWidth
          required
          label="price"
          name="price"
          value={projectEdit.price}
          onChange={handlePriceEdit}
          InputLabelProps={{ shrink: true }}
          sx={{
            mb:4
          }}
        />
        <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeProductEdit}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleEditCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Update')}
            </ButtonError>
          </Box>
          
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  projects: PropTypes.array.isRequired
};

Results.defaultProps = {
  projects: []
};

export default Results;
