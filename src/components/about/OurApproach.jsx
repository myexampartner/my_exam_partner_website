"use client";
import { Stack, Typography, Button, Box } from "@mui/material";
import React from "react";
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function OurApproach() {
  return (
    <>
     <Stack
        minWidth={"100%"}
        maxWidth={"100%"}
        px={[2,5]}
        my={10}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={5}
      >
        {/* Heading Section */}
        <Stack spacing={3} alignItems={"center"} textAlign={"center"} maxWidth={"900px"}>
          <Stack direction="row" gap={1.5} alignItems="center">
            <svg
              width="15"
              height="17"
              viewBox="0 0 15 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5026 4.90658C14.3129 2.554 15.388 1.36174 14.8771 1.17012C14.6109 1.07432 14.4939 1.0956 14.0255 1.31915C13.1206 1.76624 9.8313 4.57658 9.8313 4.90658C9.8313 5.36432 10.9384 5.37496 11.5026 4.90658Z"
                fill="var(--info-color)"
              />
              <path
                d="M4.12574 4.99165C4.47703 4.75746 4.45574 4.71487 3.09317 3.23521C2.3693 2.43677 1.77322 1.93645 1.33677 1.74484C0.740643 1.47871 0.453215 1.84067 0.687407 2.13873C2.68865 4.71488 3.51897 5.39616 4.12574 4.99165Z"
                fill="var(--info-color)"
              />
              <path
                d="M13.5998 8.46198C12.9504 8.27037 9.62923 7.21651 9.3844 7.1207C9.2673 7.07812 9.18214 6.86522 9.13956 6.50328C8.78827 3.79943 8.23462 1.02099 7.98978 0.712285C7.80882 0.478093 7.1914 0.552609 7.02108 0.818736C6.85076 1.08486 6.06302 3.77814 5.59463 5.73684L5.28603 7.01425C-0.760427 8.93037 -1.09045 8.88779 1.64534 9.72875L4.06185 10.4739C5.43506 10.8997 5.46689 10.9102 5.54141 11.2509C5.64786 11.7406 6.33979 14.1252 6.60592 15.2642C7.17011 17.7126 8.31989 16.201 9.33117 11.6449L9.56536 10.6016C9.6931 10.5804 10.502 10.5058 13.9936 9.75004C14.792 9.56907 14.5578 8.73875 13.5998 8.46198ZM12.0881 8.98359C12.003 9.05811 9.67171 9.6223 9.21397 9.6223C8.66042 9.6223 8.53268 9.88843 7.90462 12.39C7.48946 14.04 7.45763 14.0718 7.22344 13.1138C6.93602 11.9109 6.35044 10.5058 6.27592 10.1758C6.21205 9.87778 5.61593 9.66488 3.30594 9.11133C2.14568 8.83456 1.96471 8.73876 2.4011 8.61101C2.944 8.45134 5.55205 7.59973 5.85012 7.59973C6.13753 7.59973 6.38237 7.38683 6.46753 7.06748L7.29785 3.83136C7.44688 3.26717 7.44699 3.26717 7.86215 5.47071C8.34118 7.95102 8.28785 7.84446 9.05429 8.00414C10.0124 8.20639 12.184 8.89843 12.0881 8.98359Z"
                fill="var(--info-color)"
              />
              <path
                d="M10.1506 11.8152C10.1506 12.0494 12.9609 14.8916 13.3548 15.0513C14.1851 15.3919 14.398 14.9447 13.738 14.2315C11.9603 12.2834 10.1506 11.07 10.1506 11.8152Z"
                fill="var(--info-color)"
              />
              <path
                d="M1.95398 12.4965C-0.0898746 13.8803 -0.324078 14.1997 0.697852 14.1997C1.19817 14.1997 4.35972 12.0068 4.26392 11.7194C4.11489 11.2723 3.40167 11.5065 1.95398 12.4965Z"
                fill="var(--info-color)"
              />
            </svg>
            <Typography
              color="var(--info-color)"
              fontSize={25}
              fontWeight="bold"
            >
              Our Approach
            </Typography>
          </Stack>

          <Typography fontSize={[18,20,22]} lineHeight={1.7} textAlign={"center"}>
            At My Exam Partner, we go beyond helping students pass exams—we help
            them thrive. By focusing on understanding, critical thinking, and
            confidence, we prepare students with the tools they need to excel
            academically and carry those skills into every stage of life.
          </Typography>
          <Typography fontSize={[18,20,22]} fontWeight="bold" lineHeight={1.7} textAlign={"center"}>
            At My Exam Partner, we&apos;re not just preparing kids for exams. We&apos;re
            preparing them for success that lasts a lifetime.
          </Typography>
        </Stack>

        {/* PDF Download Section */}
        <Box
          sx={{
            backgroundColor: 'rgba(11, 32, 148, 0.05)',
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 5 },
            border: '2px dashed var(--info-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <PictureAsPdfIcon sx={{ fontSize: 80, color: 'var(--info-color)' }} />
          <Typography fontSize={[18,20,24]} fontWeight="bold" textAlign="center">
            Download Our Complete Approach
          </Typography>
          <Typography fontSize={[14,16]} textAlign="center" color="var(--text-secondary)">
            Get detailed insights into our teaching methodology, step-by-step process, and how we ensure exam success for every student.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: 'var(--info-color)',
              color: 'var(--text-primary)',
              py: { xs: 1.5, md: 2 },
              px: { xs: 3, md: 4 },
              borderRadius: 3,
              fontSize: { xs: 14, sm: 16, md: 18 },
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(11, 32, 148, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(11, 32, 148, 0.8)',
                boxShadow: '0 6px 16px rgba(11, 32, 148, 0.4)',
              },
            }}
            onClick={async () => {
              try {
                // Show loading alert
                Swal.fire({
                  title: 'Downloading...',
                  html: 'Please wait while we prepare your PDF',
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });

                // Fetch the PDF file
                const response = await fetch('/images/our-approach.pdf');
                
                if (!response.ok) {
                  throw new Error('Failed to download PDF');
                }

                // Convert to blob
                const blob = await response.blob();
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'MyExamPartner-Approach.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                // Show success alert
                Swal.fire({
                  icon: 'success',
                  title: 'Download Successful!',
                  text: 'Your PDF has been downloaded successfully.',
                  timer: 2000,
                  showConfirmButton: false
                });
              } catch (error) {
                // Show error alert
                Swal.fire({
                  icon: 'error',
                  title: 'Download Failed',
                  text: 'There was an error downloading the PDF. Please try again.',
                  confirmButtonColor: 'var(--info-color)'
                });
                console.error('Download error:', error);
              }
            }}
          >
            Download PDF
          </Button>
       


          <Typography variant="caption" color="var(--text-secondary)">
            PDF • ~2MB • Last updated: January 2025
          </Typography>
        </Box>
      </Stack>

    </>
  );
}

export default OurApproach;
