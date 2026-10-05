import type React from 'react';
import { Grid, Skeleton as MuiSkeleton } from '@mui/material';

interface SkeletonProps {
  columns: number;
  isLoading: boolean;
  children: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ columns, isLoading, children }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <Grid container spacing={2}>
      {Array.from({ length: columns }).map((_, index) => (
        <Grid item xs={12} md={12 / columns} key={index}>
          <MuiSkeleton variant="rectangular" height={60} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Skeleton; 