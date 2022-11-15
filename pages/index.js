import Head from 'next/head';

import { useState, useEffect, useCallback } from 'react';
import Loader from 'src/components/Loader';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Grid,Alert,List,styled,ListItem,ListItemText,Box,Typography,Divider,Avatar,Zoom} from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { fileUploadApi } from 'src/api/fileUpload';
import { projectsApi } from 'src/api/projects';
import { useSnackbar } from 'notistack';
import Results from 'src/content/Management/Projects/Results';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    margin-top: ${theme.spacing(2)};
    background: ${theme.palette.grey[300]};
    border: 1px dashed ${theme.colors.alpha.trueWhite[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.palette.grey[200]};  
      border-color: ${theme.colors.alpha.trueWhite[100]};
    }
`
);

const UploadBox = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(2)};
    background: ${theme.colors.alpha.trueWhite[70]};
`
);

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
    color: ${theme.palette.primary.main};
  `
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
    color: ${theme.colors.alpha.trueWhite[70]};
  `
);

const DividerContrast = styled(Divider)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
  `
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.palette.primary.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

function ManagementProjects() {
  const isMountedRef = useRefMounted();
  const [projects, setProjects] = useState([]); 
  const [loader, setLoader] = useState(false); 
  const [uploadStatus, setUploadStatus] = useState(false); 

  const { t } = useTranslation(); 
  const { enqueueSnackbar } = useSnackbar();

  const onDrop  = useCallback(async(uploadCSV) => {
    setLoader(true)
    await fileUploadApi.uploadCSV(uploadCSV[0])
    setLoader(false)
    setUploadStatus(true)
    enqueueSnackbar(t('File uploaded successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    window.location.reload();
}, [])

  const {
    acceptedFiles,
    isDragActive, 
    isDragAccept,  
    isDragReject, 
    getRootProps,
    getInputProps
  } = useDropzone({
    maxFiles:1,
    onDrop ,
    accept: {
      'text/csv': ['.csv ,text/csv'],
    }
  });
  


  const files = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <DividerContrast />
    </ListItem>
  ));

  

  const getProjects = useCallback(async () => {
    try {
      const response = await fileUploadApi.listProduct()

      if (isMountedRef()) {
        setProjects(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(async () => {
    setLoader(true)
    await getProjects();
    setLoader(false)
  }, [getProjects]);

// Testing

  return (
    <>
      <Head>
        <title>Tiger Analytics</title>
      </Head>
      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
        <Box sx={{mb:3 ,ml:'auto',mr:'auto',width:'30vw' , cursor:'pointer'}}>
        <UploadBox>
          {loader?<Loader />:null}
          <TypographyPrimary variant="h4" gutterBottom>
            {t('Upload CSV')}
          </TypographyPrimary>
          <BoxUploadWrapper  {...getRootProps()}>
            
            <input {...getInputProps()} />
            {isDragAccept && (
              <>
                <AvatarSuccess variant="rounded">
                  <CheckTwoToneIcon />
                </AvatarSuccess>
                <TypographyPrimary
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drop the files to start uploading')}
                </TypographyPrimary>
              </>
            )}
            {isDragReject && (
              <>
                <AvatarDanger variant="rounded">
                  <CloseTwoToneIcon />
                </AvatarDanger>
                <TypographyPrimary
                  sx={{
                    mt: 2
                  }}
                >
                  {t('You cannot upload these file types')}
                </TypographyPrimary>
              </>
            )}
            {!isDragActive && (
              <>
                <AvatarWrapper variant="rounded">
                  <CloudUploadTwoToneIcon  />
                </AvatarWrapper>
                <TypographyPrimary
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drag & drop files here')}
                </TypographyPrimary>
              </>
            )}
          </BoxUploadWrapper>
          {/* {files.length > 0 && (
            <>
              <Alert
                sx={{
                  py: 0,
                  mt: 2
                }}
                severity="success"
              >
                {t('You have uploaded')} <b>{files.length}</b> {t('files')}!
              </Alert>
              <DividerContrast
                sx={{
                  mt: 2
                }}
              />
              <List disablePadding component="div">
                {files}
              </List>
            </>
          )} */}
        </UploadBox>
        </Box>
          <Results projects={projects} />
        </Grid>
      </Grid>
    </>
  );
}

ManagementProjects.getLayout = (page) => (

    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>

);

export default ManagementProjects;
