export interface MowerActionsPayload {
  data: {
    type: 'ParkUntilFurtherNotice' | 'ResumeSchedule';
  };
}

export const PAYLOAD_RESUME: MowerActionsPayload = {
  data: {
    type: 'ResumeSchedule',
  },
};
export const PAYLOAD_PARK: MowerActionsPayload = {
  data: {
    type: 'ParkUntilFurtherNotice',
  },
};
