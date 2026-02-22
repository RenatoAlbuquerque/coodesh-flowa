import { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import dayjs from 'dayjs';
import type { Order, OrderHistory } from '../../../../@types/api';

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  history: OrderHistory[];
}

const EVENT_COLOR_MAP: Record<string, string> = {
  'Ordem Criada': '#0b66ff',
  'Execução Parcial': '#F59E0B',
  'Execução Total': '#16A34A',
  Cancelamento: '#E02424',
};

const DEFAULT_COLOR = '#94A3B8';

const DIALOG_PAPER_STYLES = {
  sx: {
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
};

const TIMELINE_STYLES = {
  [`& .${timelineOppositeContentClasses.root}`]: {
    flex: 0.3,
  },
};

export const OrderHistoryTimelineModal = memo(
  ({ open, onClose, order, history }: Props) => {
    if (!order) return null;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        PaperProps={DIALOG_PAPER_STYLES}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <HistoryIcon color="primary" />
          Histórico da Ordem #{order.id}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ display: 'flex' }}>
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Instrumento
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {order.instrument}
            </Typography>
          </Box>

          <Timeline sx={TIMELINE_STYLES}>
            {history.length > 0 ? (
              history.map((item, index) => {
                const eventColor =
                  EVENT_COLOR_MAP[item.eventType] || DEFAULT_COLOR;
                const dateObj = dayjs(item.timestamp);

                return (
                  <TimelineItem key={item.id}>
                    <TimelineOppositeContent
                      color="text.secondary"
                      variant="caption"
                    >
                      {dateObj.format('DD/MM/YYYY')}
                      <br />
                      {dateObj.format('HH:mm:ss')}
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                      <TimelineDot
                        variant={index === 0 ? 'filled' : 'outlined'}
                        sx={{
                          borderColor: eventColor,
                          bgcolor: index === 0 ? eventColor : 'transparent',
                        }}
                      />

                      {index !== history.length - 1 && (
                        <TimelineConnector
                          sx={{
                            bgcolor: eventColor,
                            width: '2px',
                            opacity: 0.4,
                          }}
                        />
                      )}
                    </TimelineSeparator>

                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography
                        variant="subtitle2"
                        component="span"
                        fontWeight={700}
                        sx={{ color: eventColor }}
                      >
                        {item.eventType}
                      </Typography>
                      <Typography variant="body2">{item.details}</Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ display: 'block' }}
                      >
                        Origem: {item.origin}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                );
              })
            ) : (
              <Typography
                variant="body2"
                textAlign="center"
                py={4}
                color="text.disabled"
              >
                Nenhum evento registrado para esta ordem.
              </Typography>
            )}
          </Timeline>
        </DialogContent>
      </Dialog>
    );
  },
);

OrderHistoryTimelineModal.displayName = 'OrderHistoryTimelineModal';
