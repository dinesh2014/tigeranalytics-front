import { useState, useRef } from 'react';

import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
  Typography,
  styled,
  Zoom
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Loader from 'src/components/Loader';
import { useSnackbar } from 'notistack';
import { fileUploadApi } from 'src/api/fileUpload';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

function BulkActions(props) {
  const [onMenuOpen, menuOpen] = useState(false);
  const [loader, setLoader] = useState(false); 
  const moreRef = useRef(null);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const handleBulkDelete = async() => {
    setLoader(true)
    try {
      await fileUploadApi.deleteProduct(props.projects)
    } catch (error) {
      setLoader(false)
    }
    
    setLoader(false)
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

  const openMenu = () => {
    menuOpen(true);
  };

  const closeMenu = () => {
    menuOpen(false);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          {loader?<Loader />:null}
          <Typography variant="h5" color="text.secondary">
            {t('Bulk actions')}:
          </Typography>
          <ButtonError
            sx={{
              ml: 1
            }}
            startIcon={<DeleteTwoToneIcon />}
            variant="contained"
            onClick={handleBulkDelete}
          >
            {t('Delete')}
          </ButtonError>
        </Box>
        <IconButton
          color="primary"
          onClick={openMenu}
          ref={moreRef}
          sx={{
            ml: 2,
            p: 1
          }}
        >
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>

      <Menu
        disableScrollLock
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          <ListItem button>
            <ListItemText primary={t('Bulk delete selected')} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={t('Reset progress for selected')} />
          </ListItem>
        </List>
      </Menu>
    </>
  );
}

export default BulkActions;
