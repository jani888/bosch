import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { ObjectTypeIcon } from './ObjectTypeIcon';
import DatasetIcon from '@mui/icons-material/Dataset';
import { TrackedObject } from '../../TrackedObject';
export function ObjectListItem(props: {
  trackedObject: TrackedObject;
  selected: boolean;
  onSelect: (uuid: string) => void;
}) {
  const [dataSheetDialogVisible, setDataSheetDialogVisible] = useState(false);
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderColor: props.selected ? 'primary.main' : '',
          flexShrink: 0,
        }}
        onClick={() => props.onSelect(props.trackedObject.uuid)}
      >
        <Box component="div" sx={{ py: 1, px: 2 }}>
          <Stack direction="row">
            <Stack direction="column">
              <Typography
                variant="caption"
                fontWeight={700}
                fontSize={10}
                color="grey.500"
              >
                {props.trackedObject.uuid}
              </Typography>
              <Stack direction="row" alignItems="center">
                <PlaceIcon sx={{ width: 14, height: 14, color: 'grey.500' }} />
                <Typography fontSize={12}>
                  x: {props.trackedObject.x.toFixed(2)} y:{' '}
                  {props.trackedObject.y.toFixed(2)}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <TipsAndUpdatesIcon
                  sx={{ width: 14, height: 14, color: 'grey.500' }}
                />
                <Typography fontSize={12}>
                  x: {props.trackedObject.prediction.x.toFixed(2)} y:{' '}
                  {props.trackedObject.prediction.y.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
            <Stack ml="auto">
              <IconButton
                sx={{ mb: 'auto' }}
                size="small"
                onClick={() => setDataSheetDialogVisible(true)}
              >
                <DatasetIcon
                  sx={{ color: 'grey.400', width: 12, height: 12 }}
                />
              </IconButton>
              <ObjectTypeIcon type={props.trackedObject.type} />
            </Stack>
          </Stack>
        </Box>
      </Card>
      <Dialog
        open={dataSheetDialogVisible}
        onClose={() => setDataSheetDialogVisible(false)}
      >
        <DialogTitle>Latest measurements and predictions</DialogTitle>
        {dataSheetDialogVisible && (
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Added time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>x</TableCell>
                  <TableCell>Y</TableCell>
                  <TableCell>vx</TableCell>
                  <TableCell>vy</TableCell>
                  <TableCell>ax</TableCell>
                  <TableCell>ay</TableCell>
                  <TableCell>Raw</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.trackedObject.history.map((measurement) => (
                  <TableRow
                    sx={{
                      backgroundColor:
                        measurement.itemType === 'prediction'
                          ? 'secondary.light'
                          : 'primary.light',
                    }}
                  >
                    <TableCell>{measurement.timestamp.toFixed(0)}</TableCell>
                    <TableCell>
                      {measurement.actualTimestamp.toFixed(0)}
                    </TableCell>
                    <TableCell>{measurement.itemType}</TableCell>
                    <TableCell>{measurement.x.toFixed(2)}</TableCell>
                    <TableCell>{measurement.y.toFixed(2)}</TableCell>
                    <TableCell>{measurement.vx.toFixed(2)}</TableCell>
                    <TableCell>{measurement.vy.toFixed(2)}</TableCell>
                    <TableCell>{measurement.ax?.toFixed(2)}</TableCell>
                    <TableCell>{measurement.ay?.toFixed(2)}</TableCell>
                    <TableCell>{JSON.stringify(measurement.raw)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDataSheetDialogVisible(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
